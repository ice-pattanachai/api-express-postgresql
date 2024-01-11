require('dotenv').config();
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { Addresses } = require('../../database/models');

router.post('/add', async (req, res, next) => {
    const data = req.body;
    try {
        const { fullname, address, postalcode, phone, user_id } = data;

        if (!fullname || !address || !postalcode || !phone || !user_id) {
            res.status(400).json({ message: 'Incomplete information. Please proceed again.' });
            return;
        }

        const newAddresses = await Addresses.create({
            fullname,
            address,
            postalcode,
            phone,
            user_id,
        });

        res.status(201).json({ message: 'Succeed', status: 'ok', Seller: newAddresses });
    } catch (error) {
        next(error);
    }
});

router.post('/edit', async (req, res, next) => {
    try {
        const addressId = req.body.id;
        const data = req.body;

        if (!addressId || Object.keys(data).length === 0) {
            return res.status(400).json({ message: 'Invalid update data' });
        }

        const addressUser = await Addresses.update(data, {
            where: { id: addressId }
        });

        if (addressUser[0] === 0) {
            return res.status(404).json({ message: 'Address not found' });
        }

        res.json({ message: 'Update successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Update error' });
    }
});

router.post('/delete', async (req, res, next) => {
    const data = req.body;
    try {
        const { id } = data;
        const addressId = id;
        if (!addressId) {
            return res.status(400).json({ message: 'Invalid delete data' });
        }

        const deletedAddress = await Addresses.destroy({
            where: { id: addressId }
        });

        if (deletedAddress === 0) {
            return res.status(404).json({ message: 'Address not found' });
        }

        res.json({ message: 'Delete successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Delete error' });
    }
});

module.exports = router;