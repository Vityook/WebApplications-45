const mongoose = require('mongoose');

// Define the shoe schema
const shoeSchema = new mongoose.Schema({
    name: String,
    price: String,
    imageSrc: String,
    rating: Number,
    isFavorite: Boolean
});

// Create the shoe model
const Shoe = mongoose.model('Shoe', shoeSchema);

// Function to seed predefined products into the DB if they don't already exist
async function seedShoes() {
    const products = [
        {
            name: 'Nike',
            price: '777$',
            imageSrc: 'images/pic2.png',
            rating: 4.5,
            isFavorite: false
        },
        {
            name: 'Nike',
            price: '100$',
            imageSrc: 'images/pic3.png',
            rating: 3.5,
            isFavorite: true
        },
        {
            name: 'Nike',
            price: '125$',
            imageSrc: 'images/pic4.png',
            rating: 4,
            isFavorite: false
        },
        {
            name: 'Nike',
            price: '99.99$',
            imageSrc: 'images/pic5.jpeg',
            rating: 5,
            isFavorite: true
        },
        {
            name: 'New Balance',
            price: '120$',
            imageSrc: 'images/Pic7.png',
            rating: 4,
            isFavorite: false
        },
        {
            name: 'adidas',
            price: '70$',
            imageSrc: 'images/pic6.png',
            rating: 3,
            isFavorite: false
        },
        {
            name: 'Nike',
            price: '300$',
            imageSrc: 'images/img1.png',
            rating: 5,
            isFavorite: true
        },
        {
            name: 'dfsdfdfdghf',
            price: '199$',
            imageSrc: 'images/img8.png',
            rating: 5,
            isFavorite: false
        }
    ];
    try {
        for (const product of products) {
            // מצא מוצר על פי imageSrc ועדכן אותו או צור חדש אם לא קיים
            const existingProduct = await Shoe.findOneAndUpdate(
                { imageSrc: product.imageSrc },  // חפש לפי imageSrc
                product,  // עדכן לפי הנתונים החדשים
                { new: true, upsert: true }  // אם לא קיים, צור אותו (upsert)
            );
            console.log(`Product ${existingProduct.name} updated/added.`);
        }
    } catch (err) {
        console.error('Error during seeding: ', err);
    }
}

// Function to get all shoes
async function getAllshoes() {
    try {
        const shoes = await Shoe.find();
        return shoes;
    } catch (err) {
        console.error('Error fetching all shoes:', err);
        return [];
    }
}

// Function to get one shoe by ID
async function getOneshoe(id) {
    try {
        const shoe = await Shoe.findById(id);
        return shoe;
    } catch (err) {
        console.error('Error fetching single shoe:', err);
        return null;
    }
}

// Function to delete a shoe by ID
async function deleteShoe(id) {
    try {
        await Shoe.findByIdAndDelete(id);
    } catch (err) {
        console.error('Error deleting shoe:', err);
    }
}

module.exports = {
    getAllshoes,
    getOneshoe,
    deleteShoe,
    seedShoes,
    Shoe
};
