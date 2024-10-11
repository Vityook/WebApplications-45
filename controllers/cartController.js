const Cart = require('../models/cart');
const Shoe = require('../models/shoes');

// Add to cart by imageSrc
exports.addToCart = async (req, res) => {
    const imageSrc = req.params.imageSrc;  // Get the imageSrc from the URL parameter
    let cart = new Cart(req.session.cart ? req.session.cart : {});  // Create or use an existing cart in the session

    try {
        // Find the shoe by its imageSrc in the database
        const shoe = await Shoe.findOne({ imageSrc: imageSrc });

        if (!shoe) {
            return res.redirect('/');  // Redirect back if no shoe is found
        }

        cart.add(shoe, shoe.imageSrc);  // Add the shoe to the cart using imageSrc as the key
        req.session.cart = cart;  // Save updated cart to session
        res.redirect('/cart');   // Redirect to the cart view

    } catch (err) {
        console.log('Error adding to cart: ', err);
        res.redirect('/');
    }
};

// View cart
exports.getCart = (req, res) => {
    if (!req.session.cart) {
        return res.render('cart.ejs', { products: null });
    }
    const cart = new Cart(req.session.cart);
    res.render('cart.ejs', { products: cart.items, totalPrice: cart.totalPrice });
};

// Remove from cart by imageSrc
exports.removeFromCart = (req, res) => {
    const imageSrc = req.params.imageSrc;  // Get the imageSrc from the URL parameter
    let cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.removeItem(imageSrc);  // Remove item by imageSrc
    req.session.cart = cart;
    res.redirect('/cart');
};

// Reduce quantity by one by imageSrc
exports.reduceByOne = (req, res) => {
    const imageSrc = req.params.imageSrc;  // Get the imageSrc from the URL parameter
    let cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.reduceByOne(imageSrc);  // Reduce quantity by imageSrc
    req.session.cart = cart;
    res.redirect('/cart');
};
