const User = require('../models/user');

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

        res.status(201).redirect('/login');  // Redirect to login page after registration
    } catch (err) {
        console.log(err);
        res.status(500).send('Server error');
    }
};

// Login logic
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send('Invalid credentials');
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).send('Invalid credentials');
        }

        // Set session or token (Here we use sessions)
        req.session.user = user;
        res.redirect('/dashboard');  // Redirect to a protected dashboard or home page

    } catch (err) {
        console.log(err);
        res.status(500).send('Server error');
    }
};

// Logout logic
exports.logout = (req, res) => {
    req.session.destroy();  // Destroy session to log out
    res.redirect('/login');
};
