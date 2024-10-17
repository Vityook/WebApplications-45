const User = require('../models/user');
const Order = require('../models/order');
const Shoe = require('../models/shoes');

exports.toggleFavorite = async (req, res) => {
    console.log('Toggle favorite request received:', req.body);
    try {
        const { productId } = req.body;
        if (!req.session.user) {
            console.log('User not authenticated');
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }
        const userId = req.session.user.id;
        console.log('User ID:', userId, 'Product ID:', productId);

        const user = await User.findById(userId);
        if (!user) {
            console.log('User not found');
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const index = user.favorites.indexOf(productId);
        if (index > -1) {
            user.favorites.pull(productId);
        } else {
            user.favorites.push(productId);
        }

        await user.save();
        console.log('Favorites updated successfully');
        res.json({ success: true, favorites: user.favorites });
    } catch (error) {
        console.error('Error toggling favorite:', error);
        res.status(500).json({ success: false, message: 'Error updating favorites', error: error.message });
    }
};

exports.addToCart = async (req, res) => {
    console.log('Add to cart request received:', req.body);
    try {
        const { productId } = req.body;
        if (!req.session.user) {
            console.log('User not authenticated');
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }
        const userId = req.session.user.id;
        console.log('User ID:', userId, 'Product ID:', productId);

        const user = await User.findById(userId);
        if (!user) {
            console.log('User not found');
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (!user.cart.includes(productId)) {
            user.cart.push(productId);
            await user.save();
            console.log('Product added to cart successfully');
            res.json({ success: true, cart: user.cart });
        } else {
            console.log('Product already in cart');
            res.json({ success: false, message: 'Product already in cart' });
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ success: false, message: 'Error adding to cart', error: error.message });
    }
};

exports.getCart = async (req, res) => {
    try {
        // Check if user is logged in
        if (!req.session.user) {
            return res.status(401).json({ error: 'User not logged in' });
        }

        const userId = req.session.user.id;
        const user = await User.findById(userId).populate('cart.shoe');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user.cart);
    } catch (error) {
        console.error('Error getting cart:', error);
        res.status(500).json({ error: 'An error occurred while getting the cart' });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        const { itemId } = req.body;
        const userId = req.session.user.id;

        const user = await User.findById(userId);
        const index = user.cart.indexOf(itemId);

        if (index > -1) {
            user.cart.splice(index, 1);
            await user.save();
            res.json({ success: true });
        } else {
            res.status(404).json({ success: false, message: 'Item not found in cart' });
        }
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({ success: false, message: 'Error removing from cart' });
    }
};

exports.getFavorites = async (req, res) => {
    try {
        if (!req.session || !req.session.user) {
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }

        const userId = req.session.user.id;
        const user = await User.findById(userId).populate('favorites');
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, favorites: user.favorites });
    } catch (error) {
        console.error('Error getting favorites:', error);
        res.status(500).json({ success: false, message: 'Error retrieving favorites', error: error.message });
    }
};

exports.createOrder = async (req, res) => {
    try {
        if (!req.session || !req.session.user) {
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }

        const userId = req.session.user.id;
        const { shippingAddress } = req.body;

        const user = await User.findById(userId).populate('cart');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (user.cart.length === 0) {
            return res.status(400).json({ success: false, message: 'Cart is empty' });
        }

        let totalAmount = 0;
        const orderItems = user.cart.map(item => {
            totalAmount += item.price;
            return {
                shoe: item._id,
                quantity: 1 // You might want to add quantity to cart items in the future
            };
        });

        const newOrder = new Order({
            user: userId,
            items: orderItems,
            totalAmount,
            shippingAddress
        });

        await newOrder.save();

        // Clear the user's cart and add the order to their history
        user.cart = [];
        user.orders.push(newOrder._id);
        await user.save();

        res.status(201).json({ success: true, message: 'Order created successfully', order: newOrder });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ success: false, message: 'Error creating order', error: error.message });
    }
};

exports.getOrderHistory = async (req, res) => {
    try {
        if (!req.session || !req.session.user) {
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }

        const userId = req.session.user.id;
        const user = await User.findById(userId).populate({
            path: 'orders',
            populate: {
                path: 'items.shoe',
                model: 'Shoe'
            }
        });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, orders: user.orders });
    } catch (error) {
        console.error('Error retrieving order history:', error);
        res.status(500).json({ success: false, message: 'Error retrieving order history', error: error.message });
    }
};