const express = require('express');
const router = express.Router();
const Product = require('../models/Product'); // Adjust the path as needed

router.get('/products', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10; // Number of products per page
        const skip = (page - 1) * limit;

        const products = await Product.find()
            .skip(skip)
            .limit(limit);

        const totalProducts = await Product.countDocuments();
        const totalPages = Math.ceil(totalProducts / limit);

        res.render('products', {
            products: products,
            currentPage: page,
            totalPages: totalPages,
            title: 'Products'
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).render('error', { message: 'Error fetching products' });
    }
});

module.exports = router;