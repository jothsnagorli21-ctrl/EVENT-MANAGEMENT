const { validationResult } = require('express-validator');
const Event = require('../models/Event');
const Feedback = require('../models/Feedback');
const AIPlan = require('../models/AIPlan');
const { generateEventPlan, generateAnnouncement, analyzeFeedback } = require('../services/geminiService');

// -------------------------------------------------------
// @desc    Generate an AI event plan
// @route   POST /api/ai/event-plan
// @access  Private — Admin only
// -------------------------------------------------------
const getEventPlan = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    const {
      eventType,
      eventTopic,
      duration,
      numberOfParticipants,
      targetAudience,
      specialRequirements,
      eventId, // optional — link plan to an existing event
    } = req.body;

    // Call the Gemini service (API key stays server-side)
    const plan = await generateEventPlan({
      eventType,
      eventTopic,
      duration,
      numberOfParticipants,
      targetAudience,
      specialRequirements,
    });

    // Optionally save the plan to MongoDB for future reference
    const savedPlan = await AIPlan.create({
      eventId: eventId || null,
      inputDetails: {
        eventType,
        eventTopic,
        duration,
        numberOfParticipants,
        targetAudience,
        specialRequirements,
      },
      schedule: plan.schedule,
      activities: plan.activities,
      tasks: plan.tasks,
      checklist: plan.checklist,
      resources: plan.resources,
      createdBy: req.user._id,
    });

    return res.status(200).json({
      success: true,
      message: 'Event plan generated successfully.',
      data: {
        planId: savedPlan._id,
        schedule: plan.schedule,
        activities: plan.activities,
        tasks: plan.tasks,
        checklist: plan.checklist,
        resources: plan.resources,
      },
    });
  } catch (error) {
    // Catch Gemini service errors and return a friendly message
    if (error.message.includes('AI service is temporarily unavailable')) {
      return res.status(503).json({ success: false, message: error.message });
    }
    next(error);
  }
};

// -------------------------------------------------------
// @desc    Generate an AI announcement for an existing event
// @route   POST /api/ai/announcement
// @access  Private — Admin only
// -------------------------------------------------------
const getAnnouncement = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    const { eventId } = req.body;

    // Fetch event details from MongoDB
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    // Only the organizer who owns this event can generate an announcement for it
    if (event.organizerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only generate announcements for your own events.',
      });
    }

    // Pass event details to Gemini — the frontend never touches the API key
    const announcement = await generateAnnouncement({
      title: event.title,
      description: event.description,
      category: event.category,
      date: event.date,
      startTime: event.startTime,
      endTime: event.endTime,
      venue: event.venue,
    });

    return res.status(200).json({
      success: true,
      message: 'Announcement generated successfully.',
      data: {
        eventId: event._id,
        eventTitle: event.title,
        announcement,
      },
    });
  } catch (error) {
    if (error.message.includes('AI service is temporarily unavailable')) {
      return res.status(503).json({ success: false, message: error.message });
    }
    next(error);
  }
};

// -------------------------------------------------------
// @desc    Analyze feedback for an event using AI
// @route   POST /api/ai/feedback-analysis
// @access  Private — Admin only
// -------------------------------------------------------
const getFeedbackAnalysis = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    const { eventId } = req.body;

    // 1. Verify the event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    // 2. Verify ownership — only the event organizer can analyse its feedback
    if (event.organizerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only analyse feedback for your own events.',
      });
    }

    // 3. Fetch all feedback for this event
    const feedbackList = await Feedback.find({ eventId });

    // 4. If there is no feedback, return a friendly message — no Gemini call needed
    if (feedbackList.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No feedback has been submitted for this event yet.',
        data: {
          eventId,
          eventTitle: event.title,
          totalFeedback: 0,
          analysis: null,
        },
      });
    }

    // 5. Send feedback to Gemini for analysis
    const analysis = await analyzeFeedback(
      feedbackList.map((fb) => ({
        rating: fb.rating,
        comment: fb.comment,
        suggestions: fb.suggestions,
      }))
    );

    return res.status(200).json({
      success: true,
      message: 'Feedback analysis completed successfully.',
      data: {
        eventId,
        eventTitle: event.title,
        totalFeedback: feedbackList.length,
        analysis: {
          overallSentiment: analysis.overallSentiment,
          averageRating: analysis.averageRating,
          commonPositivePoints: analysis.commonPositivePoints,
          commonIssues: analysis.commonIssues,
          improvementSuggestions: analysis.improvementSuggestions,
          summary: analysis.summary,
        },
      },
    });
  } catch (error) {
    if (error.message.includes('AI service is temporarily unavailable')) {
      return res.status(503).json({ success: false, message: error.message });
    }
    next(error);
  }
};

module.exports = { getEventPlan, getAnnouncement, getFeedbackAnalysis };
