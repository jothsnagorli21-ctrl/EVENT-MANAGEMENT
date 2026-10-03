const { validationResult } = require('express-validator');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const Feedback = require('../models/Feedback');

// -------------------------------------------------------
// @desc    Submit feedback for a completed event
// @route   POST /api/events/:id/feedback
// @access  Private — Student only
// -------------------------------------------------------
const submitFeedback = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    const eventId = req.params.id;
    const userId = req.user._id;

    // 1. Verify the event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    // 2. Feedback is only allowed after the event is completed
    if (event.status !== 'Completed') {
      return res.status(400).json({
        success: false,
        message: 'Feedback can only be submitted after the event has been completed.',
      });
    }

    // 3. Student must have registered for the event
    const registration = await Registration.findOne({ userId, eventId });
    if (!registration) {
      return res.status(403).json({
        success: false,
        message: 'You can only submit feedback for events you have registered for.',
      });
    }

    // 4. Prevent duplicate feedback (application-level check)
    const existingFeedback = await Feedback.findOne({ userId, eventId });
    if (existingFeedback) {
      return res.status(409).json({
        success: false,
        message: 'You have already submitted feedback for this event.',
      });
    }

    const { rating, comment, suggestions } = req.body;

    // 5. Create feedback record
    const feedback = await Feedback.create({ userId, eventId, rating, comment, suggestions });

    return res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully. Thank you!',
      data: { feedback },
    });
  } catch (error) {
    // Database-level duplicate key protection
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'You have already submitted feedback for this event.',
      });
    }
    next(error);
  }
};

// -------------------------------------------------------
// @desc    Get all feedback for an event
// @route   GET /api/events/:id/feedback
// @access  Private — Admin only (own events)
// -------------------------------------------------------
const getEventFeedback = async (req, res, next) => {
  try {
    const eventId = req.params.id;

    // Verify the event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    // Only the organizer who owns this event can read its feedback
    if (event.organizerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view feedback for your own events.',
      });
    }

    const feedbackList = await Feedback.find({ eventId })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    // Calculate average rating
    const totalRatings = feedbackList.reduce((sum, fb) => sum + fb.rating, 0);
    const averageRating = feedbackList.length > 0
      ? (totalRatings / feedbackList.length).toFixed(1)
      : null;

    // Shape the response — never expose passwords
    const feedback = feedbackList.map((fb) => ({
      _id: fb._id,
      rating: fb.rating,
      comment: fb.comment,
      suggestions: fb.suggestions,
      student: fb.userId, // populated: { _id, name, email }
      createdAt: fb.createdAt,
    }));

    return res.status(200).json({
      success: true,
      message: 'Feedback retrieved successfully.',
      data: {
        eventTitle: event.title,
        totalFeedback: feedback.length,
        averageRating,
        feedback,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { submitFeedback, getEventFeedback };
