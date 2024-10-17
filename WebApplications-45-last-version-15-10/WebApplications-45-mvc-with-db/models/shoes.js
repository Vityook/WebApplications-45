const mongoose = require('mongoose');
const Image = require('./imageModel');

// Define the shoe schema
const shoeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    image: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    isFavorite: {
        type: Boolean,
        default: false
    }
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
            name: 'New balance',
            price: '199$',
            imageSrc: 'images/img8.png',
            rating: 5,
            isFavorite: false
        }
    ];
    try {
        for (const product of products) {
            let image = await Image.findOneAndUpdate(
                { path: product.imageSrc },
                { name: product.name, path: product.imageSrc },
                { upsert: true, new: true }
            );

            const shoeData = {
                name: product.name,
                price: product.price,
                image: image._id,
                rating: product.rating,
                isFavorite: product.isFavorite
            };

            await Shoe.findOneAndUpdate(
                { name: product.name, price: product.price },
                shoeData,
                { new: true, upsert: true }
            );
        }
        
    } catch (err) {
        console.error('Error during seeding:', err);
    }
}

// Function to get all shoes
async function getAllshoes() {
    try {
        return await Shoe.find().populate('image');
    } catch (err) {
        console.error('Error fetching all shoes:', err);
        return [];
    }
}

// Function to get one shoe by ID
async function getOneshoe(id) {
    try {
        const shoe = await Shoe.findById(id).populate('image');
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

// Static method for searching shoes
shoeSchema.statics.searchShoes = async function(query) {
    return this.find({
        $or: [
            { name: { $regex: query, $options: 'i' } },
            { price: { $regex: query, $options: 'i' } }
        ]
    }).populate('image');
};

// Function to create a new shoe
async function createShoe(shoeData) {
    try {
        const newShoe = new Shoe(shoeData);
        await newShoe.save();
        return newShoe.populate('image');
    } catch (err) {
        console.error('Error creating new shoe:', err);
        throw err;
    }
}

module.exports = {
    getAllshoes,
    getOneshoe,
    deleteShoe,
    seedShoes,
    Shoe,
    createShoe
};
