const mongoose = require('mongoose');
require('dotenv').config();  // Load dotenv

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;  // Load the MongoDB URI from environment variables
    if (!mongoURI) {
      throw new Error('MONGODB_URI is not defined in the .env file');
    }

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
