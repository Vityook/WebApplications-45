const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/register', customerController.register);
router.post('/login', customerController.login);
// ... (other routes)

module.exports = router;