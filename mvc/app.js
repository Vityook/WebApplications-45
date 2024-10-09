const express = require('express');
const connectDB = require('./database');
const { seedShoes } = require('./models/shoes');
const session = require('express-session');
const cartController = require('./controllers/cartController');
const authRoutes = require('./routes/authRoutes');
const { isAuthenticated, isAdmin } = require('./middlewares/authMiddleware');
require('dotenv').config();

const app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'yoursecretkey',
  resave: false,
  saveUninitialized: false
}));

connectDB()
  .then(async () => {
    await seedShoes();

    const shoesController = require('./controllers/shoes');
    const loginController = require('./controllers/login');
    const aboutController = require('./controllers/about');
    const reviewController = require('./controllers/review');

    // Define routes with error handling
    app.get('/', (req, res) => {
      if (typeof shoesController.showAllshoes === 'function') {
        shoesController.showAllshoes(req, res);
      } else {
        res.status(500).send('showAllshoes function is not defined');
      }
    });

    app.get('/login', (req, res) => {
      if (typeof loginController.loginpage === 'function') {
        loginController.loginpage(req, res);
      } else {
        res.status(500).send('loginpage function is not defined');
      }
    });

    app.get('/shoe', (req, res) => {
      if (typeof shoesController.getOneshoe === 'function') {
        shoesController.getOneshoe(req, res);
      } else {
        res.status(500).send('getOneshoe function is not defined');
      }
    });

    app.get('/deleteshoe', (req, res) => {
      if (typeof shoesController.deleteShoe === 'function') {
        shoesController.deleteShoe(req, res);
      } else {
        res.status(500).send('deleteShoe function is not defined');
      }
    });

    app.get('/about', (req, res) => {
      if (typeof aboutController.aboutpage === 'function') {
        aboutController.aboutpage(req, res);
      } else {
        res.status(500).send('aboutpage function is not defined');
      }
    });

    app.get('/review', (req, res) => {
      if (typeof reviewController.reviewpage === 'function') {
        reviewController.reviewpage(req, res);
      } else {
        res.status(500).send('reviewpage function is not defined');
      }
    });

    // Authentication routes
    app.use(authRoutes);

    // Cart routes
    app.get('/cart', cartController.getCart);
    app.get('/cart/add/:imageSrc', cartController.addToCart);
    app.get('/cart/remove/:imageSrc', cartController.removeFromCart);
    app.get('/cart/reduce/:imageSrc', cartController.reduceByOne);
    
    app.get('/admin', isAuthenticated, isAdmin, (req, res) => {
      res.send('Welcome to the admin panel!');
    });

    app.listen(80, () => {
      console.log('Server is running on port 80');
    });
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });