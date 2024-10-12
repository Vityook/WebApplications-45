const mongoose = require('mongoose');
const connectDB = require('./database');  // Import the connectDB function
const { seedShoes } = require('./models/shoes');  // Import the seedShoes function
require('dotenv').config();  // Load environment variables

// Connect to MongoDB
connectDB().then(async () => {


    // Seed the database with products
    await seedShoes();

    mongoose.connection.close();  // Close the connection after seeding
}).catch(err => {
    console.error('Error connecting to MongoDB:', err);
});
