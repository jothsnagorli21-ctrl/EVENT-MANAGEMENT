const { validationResult } = require('express-validator');
const Event = require('../models/Event');
const Registration = require('../models/Registration');

// -------------------------------------------------------
// @desc    Create a new event
// @route   POST /api/events
// @access  Private — Admin only
// -------------------------------------------------------
const createEvent = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    const { title, description, category, date, startTime, endTime, venue, capacity, status } = req.body;

    // organizerId is always taken from the authenticated user — never from the request body
    const event = await Event.create({
      title,
      description,
      category,
      date,
      startTime,
      endTime,
      venue,
      capacity,
      status,
      organizerId: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: 'Event created successfully.',
      data: { event },
    });
  } catch (error) {
    next(error);
  }
};

// -------------------------------------------------------
// @desc    Get all events with registration count & available seats
// @route   GET /api/events
// @access  Private — All authenticated users
// -------------------------------------------------------
const getEvents = async (req, res, next) => {
  try {
    const events = await Event.find()
      .populate('organizerId', 'name email')
      .sort({ date: 1 });

    // For each event, calculate registered count and available seats
    const eventsWithStats = await Promise.all(
      events.map(async (event) => {
        const registeredCount = await Registration.countDocuments({ eventId: event._id });
        const availableSeats = event.capacity - registeredCount;

        return {
          _id: event._id,
          title: event.title,
          description: event.description,
          category: event.category,
          date: event.date,
          startTime: event.startTime,
          endTime: event.endTime,
          venue: event.venue,
          capacity: event.capacity,
          organizer: event.organizerId,
          status: event.status,
          registeredCount,
          availableSeats: availableSeats < 0 ? 0 : availableSeats,
          createdAt: event.createdAt,
        };
      })
    );

    return res.status(200).json({
      success: true,
      message: 'Events retrieved successfully.',
      data: { events: eventsWithStats },
    });
  } catch (error) {
    next(error);
  }
};

// -------------------------------------------------------
// @desc    Get a single event by ID
// @route   GET /api/events/:id
// @access  Private — All authenticated users
// -------------------------------------------------------
const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate('organizerId', 'name email');

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    const registeredCount = await Registration.countDocuments({ eventId: event._id });
    const availableSeats = event.capacity - registeredCount;

    return res.status(200).json({
      success: true,
      message: 'Event retrieved successfully.',
      data: {
        event: {
          _id: event._id,
          title: event.title,
          description: event.description,
          category: event.category,
          date: event.date,
          startTime: event.startTime,
          endTime: event.endTime,
          venue: event.venue,
          capacity: event.capacity,
          organizer: event.organizerId,
          status: event.status,
          registeredCount,
          availableSeats: availableSeats < 0 ? 0 : availableSeats,
          createdAt: event.createdAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// -------------------------------------------------------
// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private — Admin only (own events)
// -------------------------------------------------------
const updateEvent = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    // Only the organizer who created this event can update it
    if (event.organizerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only update your own events.',
      });
    }

    const { title, description, category, date, startTime, endTime, venue, capacity, status } = req.body;

    // Update only provided fields
    if (title !== undefined) event.title = title;
    if (description !== undefined) event.description = description;
    if (category !== undefined) event.category = category;
    if (date !== undefined) event.date = date;
    if (startTime !== undefined) event.startTime = startTime;
    if (endTime !== undefined) event.endTime = endTime;
    if (venue !== undefined) event.venue = venue;
    if (capacity !== undefined) event.capacity = capacity;
    if (status !== undefined) event.status = status;

    const updatedEvent = await event.save();

    return res.status(200).json({
      success: true,
      message: 'Event updated successfully.',
      data: { event: updatedEvent },
    });
  } catch (error) {
    next(error);
  }
};

// -------------------------------------------------------
// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private — Admin only (own events)
// -------------------------------------------------------
const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    // Only the organizer who created this event can delete it
    if (event.organizerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only delete your own events.',
      });
    }

    await event.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Event deleted successfully.',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createEvent, getEvents, getEventById, updateEvent, deleteEvent };
