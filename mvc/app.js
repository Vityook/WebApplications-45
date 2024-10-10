const express = require('express');
const connectDB = require('./database');  // Import the connectDB function
const { seedShoes } = require('./models/shoes');
const session = require('express-session');
const cartController = require('./controllers/cartController');
const authRoutes = require('./routes/authRoutes');  // Import the authentication routes
const { isAuthenticated, isAdmin } = require('./middlewares/authMiddleware');  // Import the middleware
require('dotenv').config();  // Load environment variables

const app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));  // To handle form data (for login and registration)

// Use session middleware for login and cart
app.use(session({
  secret: 'yoursecretkey',  // You should replace 'yoursecretkey' with a stronger secret key
  resave: false,
  saveUninitialized: false
}));

// Connect to MongoDB and seed the database
connectDB()
  .then(async () => {
    await seedShoes();  // Seed the database with products

    const shoesController = require('./controllers/shoes');
    const loginController = require('./controllers/login');
    const shopController = require('./controllers/shoppage');

    // Define routes
    app.get('/', shoesController.showAllshoes);  // Home route
    app.get('/login', loginController.loginpage);  // Render login page
    app.get('/shoppage',shopController.shoppage);
    // Authentication routes (register, login, logout)
    app.use(authRoutes);  // Use the authentication routes

    // Cart routes using imageSrc
    app.get('/cart', cartController.getCart);  // View the cart
    app.get('/cart/add/:imageSrc', cartController.addToCart);  // Add item to cart using imageSrc
    app.get('/cart/remove/:imageSrc', cartController.removeFromCart);  // Remove item from cart using imageSrc
    app.get('/cart/reduce/:imageSrc', cartController.reduceByOne);  // Reduce quantity by one using imageSrc
    
    app.get('/admin', isAuthenticated, isAdmin, (req, res) => {
      res.send('Welcome to the admin panel!');
    });
    // Start the server after seeding
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });
