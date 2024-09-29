const shoesModel =require('../models/shoes')

function  showAllshoes(req,res){
    res.render("shoes.ejs",  { "products": shoesModel.getAllshoes() })}
module.exports = {showAllshoes}
