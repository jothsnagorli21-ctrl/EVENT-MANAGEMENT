const Event = require('../models/Event');
const Registration = require('../models/Registration');

// -------------------------------------------------------
// @desc    Register a student for an event
// @route   POST /api/events/:id/register
// @access  Private — Student only
// -------------------------------------------------------
const registerForEvent = async (req, res, next) => {
  try {
    const eventId = req.params.id;
    const userId = req.user._id;

    // 1. Find the event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    // 2. Check if student is already registered (application-level check)
    const existingRegistration = await Registration.findOne({ userId, eventId });
    if (existingRegistration) {
      return res.status(409).json({
        success: false,
        message: 'You are already registered for this event.',
      });
    }

    // 3. Count current registrations and check capacity
    const registeredCount = await Registration.countDocuments({ eventId });
    if (registeredCount >= event.capacity) {
      return res.status(409).json({
        success: false,
        message: 'Registration Closed – Event is Full.',
      });
    }

    // 4. Create the registration record
    const registration = await Registration.create({ userId, eventId });

    return res.status(201).json({
      success: true,
      message: 'Successfully registered for the event.',
      data: { registration },
    });
  } catch (error) {
    // Handle MongoDB duplicate key error (database-level protection)
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'You are already registered for this event.',
      });
    }
    next(error);
  }
};

// -------------------------------------------------------
// @desc    Get all participants for an event
// @route   GET /api/events/:id/participants
// @access  Private — Admin only (own events)
// -------------------------------------------------------
const getEventParticipants = async (req, res, next) => {
  try {
    const eventId = req.params.id;

    // Verify event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    // Only the organizer who owns this event can view its participants
    if (event.organizerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view participants for your own events.',
      });
    }

    // Fetch registrations and populate student info (no password)
    const registrations = await Registration.find({ eventId })
      .populate('userId', 'name email role createdAt')
      .sort({ registeredAt: 1 });

    const participants = registrations.map((reg) => ({
      registrationId: reg._id,
      registeredAt: reg.registeredAt,
      student: reg.userId,
    }));

    return res.status(200).json({
      success: true,
      message: 'Participants retrieved successfully.',
      data: {
        eventTitle: event.title,
        totalRegistered: participants.length,
        availableSeats: event.capacity - participants.length,
        participants,
      },
    });
  } catch (error) {
    next(error);
  }
};

// -------------------------------------------------------
// @desc    Get all events a student has registered for
// @route   GET /api/my-registrations
// @access  Private — Student only
// -------------------------------------------------------
const getMyRegistrations = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const registrations = await Registration.find({ userId })
      .populate({
        path: 'eventId',
        select: 'title description category date startTime endTime venue status capacity organizerId',
        populate: { path: 'organizerId', select: 'name email' },
      })
      .sort({ registeredAt: -1 });

    const myEvents = registrations.map((reg) => ({
      registrationId: reg._id,
      registeredAt: reg.registeredAt,
      event: reg.eventId,
    }));

    return res.status(200).json({
      success: true,
      message: 'Registrations retrieved successfully.',
      data: {
        totalRegistrations: myEvents.length,
        registrations: myEvents,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { registerForEvent, getEventParticipants, getMyRegistrations };
