exports.getDashboard = (req, res) => {
    // Assuming you're using EJS as your template engine
    res.render('dashboard', { user: req.session.user });
};