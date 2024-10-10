const shoesModel =require('../models/shoes')

async function  showAllshoes(req,res){
    const products = await shoesModel.getAllshoes();  // Fetch products from MongoDB
    res.render("shoes.ejs", { products });
}
module.exports = {showAllshoes};
