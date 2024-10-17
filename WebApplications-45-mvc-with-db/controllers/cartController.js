const cartService = require('../services/cart');
console.log('cartService:', cartService);

const cartController = {
    getCart: async (req, res) => {
        try {
            if (!req.session.user || !req.session.user.id) {
                return res.status(401).json({ success: false, message: 'User not logged in' });
            }
            
            const userId = req.session.user.id;
            const cart = await cartService.getCart(userId);
            res.json(cart);
        } catch (error) {
            console.error('Error getting cart:', error);
            res.status(500).json({ success: false, message: 'Error retrieving cart' });
        }
    },

    addToCart: async (req, res) => {
        try {
            if (!req.session.user || !req.session.user.id) {
                return res.status(401).json({ success: false, message: 'User not logged in' });
            }

            const userId = req.session.user.id;
            let { productId, price, quantity, name, imageSrc } = req.body;

            // Ensure quantity is a valid number
            quantity = parseInt(quantity, 10);
            if (isNaN(quantity) || quantity <= 0) {
                return res.status(400).json({ success: false, message: 'Invalid quantity' });
            }

            const result = await cartService.addToCart(userId, productId, price, quantity, name, imageSrc);
            
            if (result) {
                // Calculate total items in cart
                const totalItems = result.reduce((sum, item) => sum + item.quantity, 0);
                res.status(200).json({ 
                    success: true, 
                    message: 'Item added to cart successfully',
                    cartCount: totalItems
                });
            } else {
                res.status(500).json({ success: false, message: 'Item wasn\'t added to cart' });
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            res.status(500).json({ success: false, message: 'Failed to add item to cart' });
        }
    },

    removeFromCart: async (req, res) => {
        try {
            if (!req.session.user || !req.session.user.id) {
                return res.status(401).json({ success: false, message: 'User not logged in' });
            }

            const userId = req.session.user.id;
            const { productId } = req.body;
            
            const result = await cartService.removeFromCart(userId, productId);
            
            if (result) {
                res.status(200).json({ success: true, message: 'Item removed from cart successfully' });
            } else {
                res.status(500).json({ success: false, message: 'Item wasn\'t removed from cart' });
            }
        } catch (error) {
            console.error('Error removing from cart:', error);
            res.status(500).json({ success: false, message: 'Failed to remove item from cart' });
        }
    }
};

module.exports = cartController;
