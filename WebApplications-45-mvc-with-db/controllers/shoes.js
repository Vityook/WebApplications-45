const { Shoe, getAllshoes, getOneshoe, deleteShoe } = require('../models/shoes');

exports.showAllshoes = async (req, res) => {
    try {
        const shoes = await getAllshoes();
        res.render('shoes', { 
            products: shoes,
            isAuthenticated: req.session.user ? true : false,
            user: req.session.user || null
        });
    } catch (error) {
        console.error('Error fetching shoes:', error);
        res.status(500).send('Error fetching shoes');
    }
};

exports.getOneshoe = async (req, res) => {
    try {
        const shoe = await getOneshoe(req.query.id);
        if (shoe) {
            res.render('shoe', { 
                product: shoe,
                isAuthenticated: req.session.user ? true : false,
                user: req.session.user || null
            });
        } else {
            res.status(404).send('Shoe not found');
        }
    } catch (error) {
        console.error('Error fetching shoe:', error);
        res.status(500).send('Error fetching shoe');
    }
};

exports.deleteShoe = async (req, res) => {
    if (!req.session.user) {
        return res.status(403).send('Unauthorized');
    }
    try {
        await deleteShoe(req.query.id);
        res.redirect('/');
    } catch (error) {
        console.error('Error deleting shoe:', error);
        res.status(500).send('Error deleting shoe');
    }
};

exports.searchShoes = async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) {
            return res.status(400).json({ error: 'Search query is required' });
        }
        
        const shoes = await Shoe.find({ name: { $regex: query, $options: 'i' } });
        res.json(shoes);
    } catch (error) {
        console.error('Error searching shoes:', error);
        res.status(500).json({ error: 'An error occurred while searching for shoes' });
    }
};