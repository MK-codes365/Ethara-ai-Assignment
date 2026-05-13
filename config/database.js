const mongoose = require('mongoose');

/*
  connectDatabase()
  Connects to MongoDB using the MONGODB_URI environment variable.
  Exits the process if the connection fails.
*/
async function connectDatabase() {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
}

module.exports = connectDatabase;
