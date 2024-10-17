const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true,
        unique: true
    }
});

imageSchema.virtual('url').get(function() {
    return `/${this.path}`;
});

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;