const mongoose = require('mongoose');
require('dotenv').config();  // Load dotenv

const connectDB = async () => {
  try {
    const mongoURI = MONGODB_URI="mongodb+srv://admin:123123123@cluster0.aqi7p.mongodb.net/shoeshopDB?retryWrites=true&w=majority&appName=Cluster0"; // Load the MongoDB URI from environment variables
    if (!mongoURI) {
      throw new Error('MONGODB_URI is not defined in the .env file');
    }

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
