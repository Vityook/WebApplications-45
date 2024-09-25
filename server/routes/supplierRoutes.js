const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const authMiddleware = require('../middlewares/authMiddleware');

// ... (CRUD routes similar to productRoutes)

module.exports = router;