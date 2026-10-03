const mongoose = require('mongoose');

const aiPlanSchema = new mongoose.Schema(
  {
    // Optional reference to an event — can be null for standalone plans
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      default: null,
    },
    // The input used to generate this plan (stored for reference)
    inputDetails: {
      eventType: String,
      eventTopic: String,
      duration: String,
      numberOfParticipants: Number,
      targetAudience: String,
      specialRequirements: String,
    },
    // Structured AI-generated plan content
    schedule: {
      type: Array,
      default: [],
    },
    activities: {
      type: Array,
      default: [],
    },
    tasks: {
      type: Array,
      default: [],
    },
    checklist: {
      type: Array,
      default: [],
    },
    resources: {
      type: Array,
      default: [],
    },
    // Store the organizer who requested the plan
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('AIPlan', aiPlanSchema);
