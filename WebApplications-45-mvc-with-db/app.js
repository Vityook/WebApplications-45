const express = require('express');
const connectDB = require('./database');
const { seedShoes } = require('./models/shoes');
const session = require('express-session');
const authRoutes = require('./routes/authRoutes');
const authController = require('./controllers/authController');
const { isAuthenticated, isAdmin } = require('./middlewares/authMiddleware');
const shoesController = require('./controllers/shoes');
const loginController = require('./controllers/login');
const aboutController = require('./controllers/about');
const servicesController = require('./controllers/services');
const reviewController = require('./controllers/review');
const adminController = require('./controllers/adminController');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'yoursecretkey',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Admin routes
app.get('/admin/panel', isAuthenticated, isAdmin, adminController.getAdminPanel);
app.post('/admin/update-user-role', isAuthenticated, isAdmin, adminController.updateUserRole);
app.delete('/admin/delete-user/:userId', isAuthenticated, isAdmin, adminController.deleteUser);
app.post('/admin/create-user', isAuthenticated, isAdmin, adminController.createUser);
app.post('/admin/reset-password/:userId', isAuthenticated, isAdmin, adminController.resetPassword);

// Authentication middleware
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.user ? true : false;
  res.locals.user = req.session.user || null;
  next();
});

// Use authentication routes
app.use('/auth', authRoutes);

// Define routes
app.get('/', shoesController.showAllshoes);
app.get('/login', loginController.loginpage);
app.get('/shoe', shoesController.getOneshoe);
app.get('/deleteshoe', isAuthenticated, isAdmin, (req, res) => {
  if (typeof shoesController.deleteShoe === 'function') {
      shoesController.deleteShoe(req, res);
  } else {
      res.status(500).send('deleteShoe function is not defined');
  }
});

app.get('/about', aboutController.aboutpage);
app.get('/review', reviewController.reviewpage);
app.get('/services', servicesController.servicespage);

// Authentication routes
app.post('/login', authController.login);

app.get('/admin', isAuthenticated, isAdmin, (req, res) => {
  res.send('Welcome to the admin panel!');
});

connectDB()
  .then(async () => {
    await seedShoes();
    const PORT = process.env.PORT || 80;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });