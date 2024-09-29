const express = require('express');
const connectDB = require('./database');  // Import the connectDB function
const { seedShoes } = require('./models/shoes');  // Import the seedShoes function
require('dotenv').config();  // Load environment variables

const app = express();
app.use(express.static('public'));

// Connect to MongoDB and seed the database
connectDB()
  .then(async () => {

    // Seed the database with products (if needed)
    await seedShoes();  // Call the seed function here

    // Import controllers
    const shoesController = require('./controllers/shoes');
    const loginController = require('./controllers/login');

    // Define routes
    app.get('/', shoesController.showAllshoes);  // Home route
    app.get('/login', loginController.loginpage);

    // Start the server after seeding
    app.listen(80, () => {
      console.log('Server is running on port 80');
    });
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });
