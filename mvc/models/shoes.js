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
            price: '70$',
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
            name: 'Adidas',
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
            name: 'New Balance',
            price: '100$',
            imageSrc: 'images/img8.png',
            rating: 5,
            isFavorite: false
        }
    ];

    try {
        // Check each product from the predefined list
        for (const product of products) {
            // Check if the product already exists by its unique 'name' field
            const existingProduct = await Shoe.findOne({ imageSrc: product.imageSrc });
            
            if (!existingProduct) {
                // If product does not exist, insert it into the collection
                await Shoe.create(product);
            }
        }

    } catch (err) {
        console.error('Error during seeding: ', err);
    }
}

// Function to get all shoes
async function getAllshoes() {
  try {
      const shoes = await Shoe.find();  // Retrieve all shoes from MongoDB
      return shoes;
  } catch (err) {
      console.error(err);
      return [];
  }
}

module.exports = {
    getAllshoes,
    seedShoes
};