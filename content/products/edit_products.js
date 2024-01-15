const express = require('express');
const router = express.Router();
const { Product } = require('../../database/models');

router.post('/', async (req, res, next) => {
    try {
        const productId = req.body.id;
        const data = req.body;

        if (!productId || Object.keys(data).length === 0) {
            return res.status(400).json({ message: 'Invalid update data' });
        }

        const updatedProduct = await Product.update(data, {
            where: { id: productId }
        });

        if (updatedProduct[0] === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ message: 'Update successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Update error' });
    }
});

module.exports = router;