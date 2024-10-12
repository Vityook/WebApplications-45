const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the user schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' }  // Define roles
});

// Hash the password before saving the user
userSchema.pre('save', async function (next) {
    try {
        if (this.isModified('password')) {
            console.log('Password field modified, hashing password');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(this.password, salt);
            this.password = hashedPassword;
            console.log('Password hashed successfully');
        } else {
            console.log('Password not modified, skipping hashing');
        }
        next();
    } catch (err) {
        console.error('Error in pre-save hook:', err);
        next(err);
    }
});

// Method to compare passwords for login
userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        console.log('Password comparison result:', isMatch);
        return isMatch;
    } catch (err) {
        console.error('Error comparing passwords:', err);
        throw err;
    }
};

const User = mongoose.model('User', userSchema);
module.exports = User;