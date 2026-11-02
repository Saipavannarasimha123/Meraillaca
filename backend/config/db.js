// config/db.js
// MongoDB connection configuration using Mongoose.
// Call connectDB() from server.js when you are ready to add a database.

const mongoose = require("mongoose");

const connectDB = async () => {
  // Make sure MONGO_URI is set in your .env file before calling this
  if (!process.env.MONGO_URI) {
    console.error("Error: MONGO_URI is not defined in your .env file.");
    process.exit(1);
  }

  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
