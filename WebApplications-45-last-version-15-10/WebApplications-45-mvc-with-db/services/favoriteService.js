// favoriteService.js (Service)
const User = require('../models/user'); // Assuming you have a User model for the database

// Toggle favorite: add or remove a product from the user's favorites
exports.toggleFavorite = async (userId, productId) => {
    try {
        const user = await User.findById(userId);

        if (!user) {
            throw new Error('User not found');
        }

        const favoriteIndex = user.favorites.indexOf(productId);

        if (favoriteIndex === -1) {
            // Add to favorites if it's not already there
            user.favorites.push(productId);
        } else {
            // Remove from favorites if it's already there
            user.favorites.splice(favoriteIndex, 1);
        }

        await user.save();
        return { favorites: user.favorites };
    } catch (error) {
        console.error('Error in toggleFavorite service:', error);
        throw error;
    }
};

// Get all favorites for the user
exports.getFavorites = async (userId) => {
    try {
        const user = await User.findById(userId).populate('favorites'); // Assuming favorites are product references

        if (!user) {
            throw new Error('User not found');
        }

        return user.favorites; // Return the populated list of favorite products
    } catch (error) {
        console.error('Error in getFavorites service:', error);
        throw error;
    }
};

// Get the count of favorites for the user
exports.getFavoritesCount = async (userId) => {
    try {
        const user = await User.findById(userId);

        if (!user) {
            throw new Error('User not found');
        }

        return user.favorites.length; // Return the count of favorite products
    } catch (error) {
        console.error('Error in getFavoritesCount service:', error);
        throw error;
    }
};
