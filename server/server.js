const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const productRoutes = require('./routes/productRoutes');
const customerRoutes = require('./routes/customerRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authMiddleware = require('./middlewares/authMiddleware');
const connectDB = require('./config/database.js');
const Product = require('./models/Product'); // Add this line

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..', 'client', 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/orders', orderRoutes);

// Page Routes
app.get('/', async (req, res) => {
  try {
    const featuredProducts = await Product.find().limit(4); // Fetch 4 featured products
    res.render('index', { title: 'Home', featuredProducts });
  } catch (error) {
    console.error('Error fetching featured products:', error);
    res.status(500).render('error', { message: 'Error fetching featured products' });
  }
});

app.get('/products', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10; // Number of products per page
    const skip = (page - 1) * limit;

    const products = await Product.find().skip(skip).limit(limit);
    const totalProducts = await Product.countDocuments();
    const totalPages = Math.ceil(totalProducts / limit);

    res.render('products', { 
      user: req.user, 
      products, 
      currentPage: page, 
      totalPages 
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).render('error', { message: 'Error fetching products' });
  }
});

app.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).render('error', { message: 'Product not found' });
    }
    res.render('product-details', { user: req.user, product });
  } catch (error) {
    console.error('Error fetching product details:', error);
    res.status(500).render('error', { message: 'Error fetching product details' });
  }
});

// ... (keep the rest of your routes as they are)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));