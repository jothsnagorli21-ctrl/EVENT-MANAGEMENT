const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required.'],
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required.'],
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required.'],
      min: [1, 'Rating must be at least 1.'],
      max: [5, 'Rating cannot exceed 5.'],
    },
    comment: {
      type: String,
      required: [true, 'Comment is required.'],
      trim: true,
    },
    suggestions: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

// Prevent a student from submitting feedback more than once for the same event
feedbackSchema.index({ userId: 1, eventId: 1 }, { unique: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
