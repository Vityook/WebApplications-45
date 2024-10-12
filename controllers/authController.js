const User = require('../models/user');
const bcrypt = require('bcrypt');
// Registration logic
exports.register = async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send('User already exists');
        }

        // Create a new user
        const newUser = new User({ username, email, password, role });
        await newUser.save();

        res.status(201).redirect('/');  // Redirect to login page after registration
    } catch (err) {
        console.log(err);
        res.status(500).send('Server error');
    }
};

// Login logic
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(400).json('Invalid credentials');
        }

        req.session.user = {
            id: user._id,
            email: user.email,
            role: user.role
        };

        res.json({ message: 'Login successful', redirectUrl: '/' });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json('Server error');
    }
};

// Logout logic
exports.logout = (req, res) => {
    req.session.destroy();  // Destroy session to log out
    res.redirect('/');
};
