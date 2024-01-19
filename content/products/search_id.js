const express = require('express');
const router = express.Router();
const { Product, Images, Categories, Promotion } = require('../../database/models');

router.post('/', async (req, res, next) => {
    try {
        const { productId } = req.body;

        if (!productId) {
            res.status(400).json({ message: 'กรุณาระบุ id ของสินค้าที่ต้องการค้นหา' });
            return;
        }

        const product = await Product.findByPk(productId, {
            include: [
                { model: Images },
                { model: Categories },
                { model: Promotion },
            ]
        });

        if (!product) {
            res.status(404).json({ message: 'ไม่พบสินค้าที่มี id ที่ระบุ' });
            return;
        }

        res.json(product);
    } catch (error) {
        next(error);
    }
});

router.get('/get/:productId', async (req, res, next) => {
    try {
        const { productId } = req.params;

        if (!productId) {
            res.status(400).json({ message: 'กรุณาระบุ id ของสินค้าที่ต้องการค้นหา' });
            return;
        }

        const product = await Product.findByPk(productId, {
            include: [
                { model: Images },
                { model: Categories },
                { model: Promotion },
            ]
        });

        if (!product) {
            res.status(404).json({ message: 'ไม่พบสินค้าที่มี id ที่ระบุ' });
            return;
        }

        res.json(product);
    } catch (error) {
        next(error);
    }
});

module.exports = router;