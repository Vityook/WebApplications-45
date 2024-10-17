const express = require('express');
const connectDB = require('./database');
const { seedShoes } = require('./models/shoes');
const session = require('express-session');
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cart'); // Import cart routes
const favoriteRoutes = require('./routes/favoritesRoutes'); // Import favorite routes
const authController = require('./controllers/authController');
const { isAuthenticated, isAdmin } = require('./middlewares/authMiddleware');
const shoesController = require('./controllers/shoes');
const loginController = require('./controllers/login');
const aboutController = require('./controllers/about');
const servicesController = require('./controllers/services');
const reviewController = require('./controllers/review');
const adminController = require('./controllers/adminController');
const userController = require('./controllers/userController');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

// Session Configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'yoursecretkey',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Authentication Middleware: Global user check for views
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.user ? true : false;
  res.locals.user = req.session.user || null;
  next();
});

// Public routes
app.get('/', shoesController.showAllshoes);
app.get('/login', loginController.loginpage);
app.get('/about', aboutController.aboutpage);
app.get('/review', reviewController.reviewpage);
app.get('/services', servicesController.servicespage);
app.get('/shoe', shoesController.getOneshoe);
app.get('/search', shoesController.searchShoes);

// Authentication routes
app.use('/auth', authRoutes);

// Cart routes
app.use('/cart', cartRoutes); 

// Favorite routes
app.use('/favorite', favoriteRoutes); 

// Handle login form
app.post('/login', authController.login);

// Protected user routes (with isAuthenticated middleware)
app.post('/toggle-favorite', isAuthenticated, userController.toggleFavorite);
app.get('/cart', isAuthenticated, userController.getCart);
app.post('/cart/add', isAuthenticated, userController.addToCart);
app.post('/cart/remove', isAuthenticated, userController.removeFromCart);
app.post('/create-order', isAuthenticated, userController.createOrder);
app.get('/order-history', isAuthenticated, userController.getOrderHistory);

// Admin routes (with isAdmin middleware)
app.get('/admin', isAuthenticated, isAdmin, (req, res) => {
  res.send('Welcome to the admin panel!');
});
app.get('/admin/panel', isAuthenticated, isAdmin, adminController.getAdminPanel);
app.post('/admin/update-user-role', isAuthenticated, isAdmin, adminController.updateUserRole);
app.delete('/admin/delete-user/:userId', isAuthenticated, isAdmin, adminController.deleteUser);
app.post('/admin/create-user', isAuthenticated, isAdmin, adminController.createUser);
app.post('/admin/reset-password/:userId', isAuthenticated, isAdmin, adminController.resetPassword);
app.post('/admin/update-shoe/:shoeId', isAuthenticated, isAdmin, adminController.updateShoe);
app.post('/admin/add-shoe', isAuthenticated, isAdmin, adminController.addShoe);
app.get('/admin/add-shoe', isAuthenticated, isAdmin, adminController.renderAddShoeForm);


// Deleting shoes as an admin
app.get('/deleteshoe', isAuthenticated, isAdmin, (req, res) => {
  if (typeof shoesController.deleteShoe === 'function') {
    shoesController.deleteShoe(req, res);
  } else {
    res.status(500).send('deleteShoe function is not defined');
  }
});

// Connect to MongoDB and seed products
connectDB()
  .then(async () => {
    await seedShoes(); // Seed the shoes into the database
    const PORT = process.env.PORT || 80;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });
