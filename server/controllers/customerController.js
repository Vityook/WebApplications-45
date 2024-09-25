const Customer = require('../models/Customer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let customer = await Customer.findOne({ email });
    if (customer) return res.status(400).json({ message: 'Customer already exists' });

    customer = new Customer({ name, email, password });
    const salt = await bcrypt.genSalt(10);
    customer.password = await bcrypt.hash(password, salt);
    await customer.save();

    const payload = { customer: { id: customer.id } };
    jwt.sign(payload, 'your_jwt_secret', { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const customer = await Customer.findOne({ email });
    if (!customer) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const payload = { customer: { id: customer.id } };
    jwt.sign(payload, 'your_jwt_secret', { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createProduct = async (req, res) => {
    try {
      const product = new Product(req.body);
      await product.save();
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  exports.getAllProducts = async (req, res) => {
    try {
      const products = await Product.find();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  exports.getProductById = async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).json({ message: 'Product not found' });
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  exports.updateProduct = async (req, res) => {
    try {
      const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!product) return res.status(404).json({ message: 'Product not found' });
      res.json(product);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  exports.deleteProduct = async (req, res) => {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) return res.status(404).json({ message: 'Product not found' });
      res.json({ message: 'Product deleted' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  exports.searchProducts = async (req, res) => {
    try {
      const { name, minPrice, maxPrice, category } = req.query;
      let query = {};
      if (name) query.name = new RegExp(name, 'i');
      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = minPrice;
        if (maxPrice) query.price.$lte = maxPrice;
      }
      if (category) query.category = category;
  
      const products = await Product.find(query);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };