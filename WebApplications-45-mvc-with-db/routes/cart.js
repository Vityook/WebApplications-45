const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { isAuthenticated } = require('../middlewares/authMiddleware');


// router.get('/get-cart', cartController.register);

// router.post('/add', cartController.add);
// router.post('/remove', cartController.remove);




if (cartController.getCart) {
    router.get('/get-cart', isAuthenticated, cartController.getCart);
} else {
    console.error('cartController.getCart is not defined');
}

if (cartController.addToCart) {
    router.post('/add', isAuthenticated, cartController.addToCart);
} else {
    console.error('cartController.addToCart is not defined');
}

if (cartController.removeFromCart) {
    router.post('/remove', isAuthenticated, cartController.removeFromCart);
} else {
    console.error('cartController.removeFromCart is not defined');
}

module.exports = router;



// Route /cart
// subroutes: /cart/get-cart , /cart/add , /cart/remove
// dedicated controller - cartControler - put here the fuctions that the route will call - from the functions call services
// servics - here create cart.js import the model and any interaction with the db will be from here!

// route:
// const express = require('express');
// const router = express.Router();
// const { addToCart } = require('../controllers/cart'); # notice this is a controller
// router.post('/add', addToCart);


// Controller:
// const cartService = require('../services/cart');
// const addToCart = async (req, res) => {

//     const username = req.session.username;
//     const { accessoryId, price, quantity, title, img } = req.body;
    
//     if (!username) {
//         res.status(401).json({ success: false, message: 'Add locally no user is authonticated', localUser: true });
//         return;
//     }
    
//     try {
//         const result = await cartService.addToCart(username, accessoryId, price, quantity, title, img);
        
//         if (result) {
//             res.status(200).json({ success: true, message: 'Item added to cart successfully' });
//         }
//         else {
//             res.status(500).json({ success: false, message: 'Item wasn\'t added to cart' });
//         }
//     } catch (err) {
//         res.status(500).json({ success: false, error: 'Failed to update accessory' });
//     }
// };

// module.exports = { 
//     addToCart,
//     # .... Rest of the functions here
// };


// Services:
// const User = require('../models/user'); // This is my model for the products so switch to yours
// const addToCart = async (username, accessoryId, price, quantity, title, img) => {
//     try {
//         const user = await User.findOne({ _id: username });
    
//         if (!user) {
//             console.log('User not found');
//             return {"localUser": true}
//         }

//         // Check if the item is already in the cart
//         const cartItem = user.cart.find(item => item.accessoryId.toString() === accessoryId);

//         if (cartItem) {
//             // If the item exists, increment the quantity
//             cartItem.quantity += quantity;
//         } else {
//             // If the item doesn't exist, add a new item to the cart
//             user.cart.push({
//                 accessoryId,
//                 quantity,
//                 price,
//                 title,
//                 img,
//                 addedAt: new Date(),
//             });
//         }

//         await user.save();
//         return user.cart;
//     } catch (error) {
//         console.error('Error adding to cart:', error);
//         throw error;
//     }
// };

// module.exports = {
//     addToCart,
//     // REst of the functions here
// };

// const { Schema, model } = require('mongoose');

// const User = new Schema({
//     _id: String, // mail 
//     password: { type: String, required: true },
//     firstName: String,
//     lastName: String,
//     gender: { type: String, enum: ['Male', 'Female', 'Rather not say'], required: true },
//     address: String,
//     wishlist: Array,
//     isAdmin: Boolean,
//     cart: [
//         {
//             accessoryId: String,
//             quantity: Number,
//             price: Number,
//             title: String,
//             img: String,
//             addedAt: Date
//         }
//     ],
//     resetPasswordToken: String, // Token to reset the password
//     resetPasswordExpires: Date // Token expiration time
// });

// module.exports = model('users', User);



// Overall process:
// Frontend- ejs file -> to frontend-js file -> app.js-> to routes -> to controller > to service -> model