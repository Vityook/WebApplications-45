// favoriteController.js (Controller)
const favoriteService = require('../services/favoriteService');

// Toggle favorite: add or remove a product from the user's favorites
exports.toggleFavorite = async (req, res) => {
    try {
        const userId = req.session.userId; // Assuming you're using session to track logged-in user
        const { productId } = req.body;

        const result = await favoriteService.toggleFavorite(userId, productId);

        res.json({
            success: true,
            favorites: result.favorites
        });
    } catch (error) {
        console.error('Error toggling favorite:', error);
        res.status(500).json({ success: false, message: 'Error toggling favorite' });
    }
};

// Get all favorites for the logged-in user
exports.getFavorites = async (req, res) => {
    try {
        const userId = req.session.userId;
        const favorites = await favoriteService.getFavorites(userId);

        res.json({
            success: true,
            favorites: favorites
        });
    } catch (error) {
        console.error('Error fetching favorites:', error);
        res.status(500).json({ success: false, message: 'Error fetching favorites' });
    }
};

// Get the count of favorites for the logged-in user
exports.getFavoritesCount = async (req, res) => {
    try {
        const userId = req.session.userId;
        const count = await favoriteService.getFavoritesCount(userId);

        res.json({ success: true, count: count });
    } catch (error) {
        console.error('Error fetching favorites count:', error);
        res.status(500).json({ success: false, message: 'Error fetching favorites count' });
    }
};
