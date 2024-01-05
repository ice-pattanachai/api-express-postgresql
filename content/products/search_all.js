const express = require('express');
const router = express.Router();
const { Product, Images, Categories, Promotion } = require('../../database/models');

router.post('/', async (req, res, next) => {
    try {
        const products = await Product.findAll({
            include: [
                { model: Images },
                { model: Categories },
                { model: Promotion },
            ]
        });
        res.json(products);
    } catch (error) {
        next(error);
    }
});

module.exports = router;