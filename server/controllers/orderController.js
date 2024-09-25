const Order = require('../models/Order');

exports.createOrder = async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getOrdersByCustomer = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.params.customerId }).populate('products.product');
    res.json(orders);
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
  