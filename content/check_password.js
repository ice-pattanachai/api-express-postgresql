const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { Users, Seller } = require('../database/models');
const saltRounds = 12;

router.post('/user', async (req, res) => {
    const { id, password_hash } = req.body;
    try {
        const user = await Users.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const passwordMatch = await bcrypt.compare(password_hash, user.password_hash);
        if (passwordMatch) {
            return res.status(200).json({ message: 'The password is correct.' });
        } else {
            return res.status(401).json({ message: 'The password is incorrect.' });
        }
    } catch (error) {
        console.error('There was an error verifying password.:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/seller', async (req, res) => {
    const { id, password_hash } = req.body;
    try {
        const user = await Seller.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const passwordMatch = await bcrypt.compare(password_hash, user.password_hash);
        if (passwordMatch) {
            return res.status(200).json({ message: 'The password is correct.' });
        } else {
            return res.status(401).json({ message: 'The password is incorrect.' });
        }
    } catch (error) {
        console.error('There was an error verifying password.:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
