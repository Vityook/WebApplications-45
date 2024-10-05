const express = require('express');
const app = express();


app.use(express.static('public'));

// Controllers
const shoesController = require('./controllers/shoes');
const loginController = require('./controllers/login');
const shoeController = require('./controllers/shoes'); // This is redundant, so you can remove one
const shopController = require('./controllers/shoppage');
const reviewController = require('./controllers/review');


app.get('/', shoesController.showAllshoes); // Show all shoes when accessing the homepage
app.get('/login', loginController.loginpage);
app.get('/shoe', shoeController.getOneshoe);
app.get('/deleteshoe', shoeController.deleteShoe);
app.get('/shoppage', shopController.shoppage);
app.get('/review', reviewController.reviewpage);


app.listen(80)
