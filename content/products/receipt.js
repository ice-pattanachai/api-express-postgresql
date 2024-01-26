require('dotenv').config();
const express = require('express');
const router = express.Router();
const { Receipt } = require('../../database/models');

router.post('/add', async (req, res, next) => {
    const data = req.body;
    try {
        const {
            order_receipt_number, receipt_make_payment, receipt_visibility,
            receipt_status, receipt_confirm_payment, payment_format,
        } = data;

        const newReceipt = await Receipt.create({
            order_receipt_number,
            receipt_make_payment,
            receipt_visibility,
            receipt_status,
            receipt_confirm_payment,
            payment_format,
        });

        res.status(201).json({ message: 'Succeed', status: 'ok', Receipt: newReceipt });
    } catch (error) {
        next(error);
    }
});

router.post('/search/all', async (req, res, next) => {
    try {
        const Receipt_orders = await Receipt.findAll({});
        res.json(Receipt_orders);
    } catch (error) {
        next(error);
    }
});

router.post('/search/Id', async (req, res, next) => {
    const { id } = req.body;
    console.log(id);
    try {
        const Receipt_orders = await Receipt.findAll({
            where: {
                id: id,
            },
        });

        res.status(200).json({ message: 'Success', status: 'ok', Receipt_orders });
    } catch (error) {
        next(error);
    }
});

router.post('/edit', async (req, res, next) => {
    try {
        const id = req.body.id;
        const data = req.body;

        if (!id || Object.keys(data).length === 0) {
            return res.status(400).json({ message: 'Invalid update data' });
        }

        const updatedReceipt = await Receipt.update(data, {
            where: { id: id }
        });

        if (updatedReceipt[0] === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ message: 'Update successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Update error' });
    }
});

module.exports = router;