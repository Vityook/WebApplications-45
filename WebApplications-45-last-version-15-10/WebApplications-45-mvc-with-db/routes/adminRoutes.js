const express = require('express');
const adminController = require('../controllers/adminController');
const router = express.Router();

// POST route to add a new shoe
router.post('/add-shoe', adminController.addShoe);

module.exports = router;