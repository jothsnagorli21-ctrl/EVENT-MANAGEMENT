const mongoose = require('mongoose');

// Connect to MongoDB using the URI from environment variables
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    // Exit the process if MongoDB cannot connect — fail gracefully
    process.exit(1);
  }
};

module.exports = connectDB;
