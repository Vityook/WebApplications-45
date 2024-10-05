//נטפל בכל הבקשות שמגיעות מהדפדפן
// מחיקת מוצר, יצירת מוצר, הצגת מוצר...

const shoesModel =require('../models/shoes')
 
function  showAllshoes(req,res){
    res.render("shoes.ejs",  { "products": shoesModel.getAllshoes() })}


function getOneshoe(req, res) {
    const shoeId = req.query.id; // Get the shoe ID from the query parameters
    const shoe = shoesModel.getOneshoe(shoeId); // Retrieve the shoe by ID from your model
        if (shoe) {
            res.render("shoe.ejs", { product: shoe }); // Pass the shoe as "product" to the EJS view
        } else {
            res.status(404).send("Shoe not found");
        }
}

function deleteShoe(req,res){
    const shoeId = req.query.id;
    const shoe = shoesModel.deleteShoe(shoeId);
    //showAllshoes(req,res)
    res.redirect("/")//when we refresh we need to make sure that the server complete from where he started
}
  
module.exports = {showAllshoes,
                  getOneshoe,
                  deleteShoe}


