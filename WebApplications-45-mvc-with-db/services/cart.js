const User = require('../models/user');

// Get the user's cart
const getCart = async (userId) => {
    try {
        const user = await User.findById(userId).populate('cart.shoe');
        if (!user || !user.cart) {
            console.log('User or cart not found');
            return [];
        }
        return user.cart;
    } catch (error) {
        console.error('Error getting cart:', error);
        throw error;
    }
};

// Add an item to the cart
const addToCart = async (userId, productId, price, quantity, name, imageSrc) => {
    try {
        const user = await User.findById(userId);

        if (!user) {
            console.log('User not found');
            return null;
        }

        // Ensure that user.cart exists
        if (!user.cart) {
            user.cart = [];
        }

        console.log('Product ID:', productId);

        // Check if the item already exists in the cart, add defensive checks for item.shoe
        const cartItemIndex = user.cart.findIndex(item => {
            // Check if item.shoe exists before calling .toString()
            if (item.shoe && item.shoe.toString) {
                return item.shoe.toString() === productId.toString();
            }
            return false;
        });

        if (cartItemIndex > -1) {
            // If the item exists, increment the quantity
            user.cart[cartItemIndex].quantity += quantity;
        } else {
            // If the item doesn't exist, add a new item to the cart
            user.cart.push({
                shoe: productId,
                quantity,
                price,
                name,
                imageSrc
            });
        }

        await user.save();
        return user.cart;
    } catch (error) {
        console.error('Error adding to cart:', error);
        throw error;
    }
};

// Remove an item from the cart
const removeFromCart = async (userId, productId) => {
    try {
        const user = await User.findById(userId);
        
        if (!user) {
            console.log('User not found');
            return null;
        }

        // Ensure that user.cart exists
        if (!user.cart) {
            user.cart = [];
        }

        // Filter out the item from the cart
        user.cart = user.cart.filter(item => item.shoe.toString() !== productId.toString());

        await user.save();
        return user.cart;
    } catch (error) {
        console.error('Error removing from cart:', error);
        throw error;
    }
};

module.exports = {
    getCart,
    addToCart,
    removeFromCart
};
