const express= require('express')
const app = express()
app.use(express.static('public'))

const shoesController = require('./controllers/shoes')
const loginController = require('./controllers/login')
const shoeController = require('./controllers/shoes')

app.get('/', shoesController.showAllshoes)//  אם פונים לשרת ומבקשים את עמוד הבית נפעיל את הפונקציה שתתן את כל הנעליים
app.get('/login', loginController.loginpage)
app.get('/shoe',shoeController.getOneshoe)
app.get('/deleteshoe',shoeController.deleteShoe)


app.listen(80)