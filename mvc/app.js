const express= require('express')
const connectDB = require('./database');  // Import the connectDB function
require('dotenv').config();  // Load environment variables

const app = express()
app.use(express.static('public'))

// Connect to MongoDB
connectDB();


const shoesController = require('./controllers/shoes')
const loginController = require('./controllers/login')

app.get('/', shoesController.showAllshoes)//  אם פונים לשרת ומבקשים את עמוד הבית נפעיל את הפונקציה שתתן את כל הנעליים
app.get('/login', loginController.loginpage)

app.listen(80, () => {
    console.log('Server is running on port 80');
});