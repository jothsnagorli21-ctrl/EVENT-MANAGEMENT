const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required.'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Event description is required.'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Event category is required.'],
      enum: {
        values: ['Workshop', 'Hackathon', 'Seminar', 'Cultural', 'Sports', 'Technical', 'Other'],
        message: 'Category must be one of: Workshop, Hackathon, Seminar, Cultural, Sports, Technical, Other.',
      },
    },
    date: {
      type: Date,
      required: [true, 'Event date is required.'],
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required.'],
      trim: true,
    },
    endTime: {
      type: String,
      required: [true, 'End time is required.'],
      trim: true,
    },
    venue: {
      type: String,
      required: [true, 'Venue is required.'],
      trim: true,
    },
    capacity: {
      type: Number,
      required: [true, 'Capacity is required.'],
      min: [1, 'Capacity must be at least 1.'],
    },
    // References the admin/organizer who created this event
    organizerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ['Upcoming', 'Ongoing', 'Completed'],
        message: 'Status must be one of: Upcoming, Ongoing, Completed.',
      },
      default: 'Upcoming',
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

module.exports = mongoose.model('Event', eventSchema);
