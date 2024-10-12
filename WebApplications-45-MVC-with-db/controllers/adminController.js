const User = require('../models/user');
const bcrypt = require('bcrypt');

exports.getAdminPanel = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.render('admin/panel', { users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Error fetching users');
    }
};

exports.updateUserRole = async (req, res) => {
    const { userId, newRole } = req.body;
    try {
        const user = await User.findByIdAndUpdate(userId, { role: newRole }, { new: true });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, user });
    } catch (error) {
        console.error('Error updating user role:', error);
        res.status(500).json({ success: false, message: 'Error updating user role' });
    }
};

exports.deleteUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ success: false, message: 'Error deleting user' });
    }
};

exports.createUser = async (req, res) => {
    const { username, email, password, role } = req.body;
    try {
        console.log('Attempting to create user:', { username, email, role });
        
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            console.log('User already exists:', existingUser);
            return res.status(400).json({ success: false, message: 'Username or email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role
        });

        const savedUser = await newUser.save();
        console.log('User created successfully:', savedUser);
        res.status(201).json({ success: true, message: 'User created successfully', user: savedUser });
    } catch (error) {
        console.error('Error creating user:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ success: false, message: 'Error creating user', error: error.message });
    }
};

exports.resetPassword = async (req, res) => {
    const { userId } = req.params;
    const { newPassword } = req.body;
    
    console.log('Received password reset request for user:', userId);

    try {
        const user = await User.findById(userId);
        if (!user) {
            console.log('User not found:', userId);
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Set the new password - it will be hashed by the pre-save hook
        user.password = newPassword;
        await user.save();

        res.json({ success: true, message: 'Password reset successfully' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ success: false, message: 'Error resetting password' });
    }
};