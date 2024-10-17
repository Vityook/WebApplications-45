// favorite.js (Routes)
const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');

// Toggle favorite (add/remove)
router.post('/toggle-favorite', favoriteController.toggleFavorite);

// Get all favorites for the logged-in user
router.get('/get-favorites', favoriteController.getFavorites);

// Get the count of favorites for the logged-in user
router.get('/get-favorites-count', favoriteController.getFavoritesCount);

module.exports = router;
