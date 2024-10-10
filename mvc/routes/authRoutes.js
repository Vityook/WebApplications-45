const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
// Registration page
router.get('/register', (req, res) => {
    res.render('register.ejs');  // Show registration form
});

// Registration route
router.post('/register', authController.register);

// Login page
router.get('/login', (req, res) => {
    res.render('login.ejs');  // Show login form
});
//shoppage

router.get('/shoppage', (req, res) => {
    res.render('shoppage.ejs');  // Show shop page 
});

router.post('/shoppage',authController.shoppage);

router.post('/login', authController.login);

// Logout route
router.get('/logout', authController.logout);

module.exports = router;

