const express= require('express')
const app = express()
app.use(express.static('public'))

const shoesController = require('./controllers/shoes')
const loginController = require('./controllers/login')

app.get('/', shoesController.showAllshoes)//  אם פונים לשרת ומבקשים את עמוד הבית נפעיל את הפונקציה שתתן את כל הנעליים
app.get('/login', loginController.loginpage)

app.listen(80)
