const express= require('express')
const app = express()
app.use(express.static('public'))

const shoesController = require('./controllers/shoes')
const loginController = require('./controllers/login')

app.get('/', shoesController.showAllshoes)
app.get('/login', loginController.loginpage)

app.listen(80)
