const Event = require('../models/Event');
const Registration = require('../models/Registration');
const Feedback = require('../models/Feedback');
const User = require('../models/User');

// -------------------------------------------------------
// @desc    Get admin dashboard statistics
// @route   GET /api/dashboard/admin
// @access  Private — Admin only
// -------------------------------------------------------
const getAdminDashboard = async (req, res, next) => {
  try {
    const today = new Date();

    // --- Summary counts (all from MongoDB) ---
    const totalEvents = await Event.countDocuments();
    const upcomingEvents = await Event.countDocuments({ status: 'Upcoming' });
    const ongoingEvents = await Event.countDocuments({ status: 'Ongoing' });
    const completedEvents = await Event.countDocuments({ status: 'Completed' });
    const totalRegistrations = await Registration.countDocuments();
    const totalFeedback = await Feedback.countDocuments();

    // Total unique participants (distinct users who registered for at least one event)
    const uniqueParticipants = await Registration.distinct('userId');
    const totalParticipants = uniqueParticipants.length;

    // --- Upcoming events detail (next 10, sorted by date) ---
    const upcomingEventsList = await Event.find({ status: 'Upcoming' })
      .sort({ date: 1 })
      .limit(10)
      .select('title date venue capacity organizerId');

    // Add registration count to each upcoming event
    const upcomingEventsWithStats = await Promise.all(
      upcomingEventsList.map(async (event) => {
        const registeredCount = await Registration.countDocuments({ eventId: event._id });
        return {
          _id: event._id,
          title: event.title,
          date: event.date,
          venue: event.venue,
          capacity: event.capacity,
          registrations: registeredCount,
          availableSeats: event.capacity - registeredCount,
        };
      })
    );

    // --- Recent registrations (last 5) ---
    const recentRegistrations = await Registration.find()
      .sort({ registeredAt: -1 })
      .limit(5)
      .populate('userId', 'name email')
      .populate('eventId', 'title date');

    return res.status(200).json({
      success: true,
      message: 'Admin dashboard data retrieved successfully.',
      data: {
        stats: {
          totalEvents,
          upcomingEvents,
          ongoingEvents,
          completedEvents,
          totalRegistrations,
          totalParticipants,
          totalFeedback,
        },
        upcomingEvents: upcomingEventsWithStats,
        recentRegistrations: recentRegistrations.map((r) => ({
          _id: r._id,
          student: r.userId,
          event: r.eventId,
          registeredAt: r.registeredAt,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

// -------------------------------------------------------
// @desc    Get student dashboard statistics
// @route   GET /api/dashboard/student
// @access  Private — Student only
// -------------------------------------------------------
const getStudentDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Events this student has registered for
    const myRegistrations = await Registration.find({ userId })
      .populate({
        path: 'eventId',
        select: 'title description category date startTime endTime venue status capacity',
      })
      .sort({ registeredAt: -1 });

    // Separate registered events by status
    const myUpcoming = myRegistrations.filter(
      (r) => r.eventId && r.eventId.status === 'Upcoming'
    );
    const myCompleted = myRegistrations.filter(
      (r) => r.eventId && r.eventId.status === 'Completed'
    );
    const myOngoing = myRegistrations.filter(
      (r) => r.eventId && r.eventId.status === 'Ongoing'
    );

    // All available (upcoming) events the student has NOT yet registered for
    const registeredEventIds = myRegistrations
      .filter((r) => r.eventId)
      .map((r) => r.eventId._id);

    const availableEvents = await Event.find({
      status: 'Upcoming',
      _id: { $nin: registeredEventIds },
    })
      .sort({ date: 1 })
      .limit(10)
      .select('title category date startTime endTime venue capacity status');

    // Add available seat count to each available event
    const availableEventsWithSeats = await Promise.all(
      availableEvents.map(async (event) => {
        const registeredCount = await Registration.countDocuments({ eventId: event._id });
        return {
          _id: event._id,
          title: event.title,
          category: event.category,
          date: event.date,
          startTime: event.startTime,
          endTime: event.endTime,
          venue: event.venue,
          capacity: event.capacity,
          status: event.status,
          availableSeats: event.capacity - registeredCount,
        };
      })
    );

    return res.status(200).json({
      success: true,
      message: 'Student dashboard data retrieved successfully.',
      data: {
        stats: {
          totalRegistered: myRegistrations.length,
          upcomingRegistered: myUpcoming.length,
          ongoingRegistered: myOngoing.length,
          completedRegistered: myCompleted.length,
          availableToRegister: availableEventsWithSeats.length,
        },
        myUpcomingEvents: myUpcoming.map((r) => ({
          registrationId: r._id,
          registeredAt: r.registeredAt,
          event: r.eventId,
        })),
        myCompletedEvents: myCompleted.map((r) => ({
          registrationId: r._id,
          registeredAt: r.registeredAt,
          event: r.eventId,
        })),
        availableEvents: availableEventsWithSeats,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAdminDashboard, getStudentDashboard };
