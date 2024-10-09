const shoesModel = require('../models/shoes');

async function showAllshoes(req, res) {
    try {
        const products = await shoesModel.getAllshoes();  // Fetch products from MongoDB
        res.render("shoes.ejs", { products });
    } catch (error) {
        console.error("Error fetching all shoes:", error);
        res.status(500).send("Error fetching shoes");
    }
}

async function getOneshoe(req, res) {
    const shoeId = req.query.id; // Get the shoe ID from the query parameters
    try {
        const shoe = await shoesModel.getOneshoe(shoeId); // Retrieve the shoe by ID from MongoDB
        if (shoe) {
            res.render("shoe.ejs", { product: shoe }); // Pass the shoe as "product" to the EJS view
        } else {
            res.status(404).send("Shoe not found");
        }
    } catch (error) {
        console.error("Error fetching single shoe:", error);
        res.status(500).send("Error fetching shoe");
    }
}

async function deleteShoe(req, res) {
    const shoeId = req.query.id;
    try {
        await shoesModel.deleteShoe(shoeId);
        res.redirect("/"); // Redirect to the home page after deletion
    } catch (error) {
        console.error("Error deleting shoe:", error);
        res.status(500).send("Error deleting shoe");
    }
}

module.exports = {
    showAllshoes,
    getOneshoe,
    deleteShoe
};