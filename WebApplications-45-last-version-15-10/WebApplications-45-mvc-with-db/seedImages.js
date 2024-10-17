const mongoose = require('mongoose');
const Image = require('./models/imageModel');
require('dotenv').config();

const images = [
    { name: 'Image 2', path: 'images/pic2.png' },
    { name: 'Image 3', path: 'images/pic3.png' },
    { name: 'Image 4', path: 'images/pic4.png' },
    { name: 'Image 5', path: 'images/pic5.jpeg' },
    { name: 'Image 6', path: 'images/pic6.png' },
    { name: 'Image 7', path: 'images/Pic7.png' },
    { name: 'Image 8', path: 'images/img8.png' }
];

async function seedImages() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        for (const image of images) {
            await Image.findOneAndUpdate(
                { name: image.name },
                image,
                { upsert: true, new: true }
            );
            console.log(`Image ${image.name} added/updated.`);
        }

        console.log('Image seeding completed.');
    } catch (error) {
        console.error('Error seeding images:', error);
    } finally {
        mongoose.disconnect();
    }
}

seedImages();