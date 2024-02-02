require('dotenv').config();
const express = require('express');
const router = express.Router();
const { PurchaseOrders, Product, Users, Receipt } = require('../../database/models');

router.post('/add', async (req, res, next) => {
  const data = req.body;

  try {
    const {
      addresses_name, address, postalcode, phone, quantity, total_price, status, parcel_number, user_id, product_id, receipt_id,
    } = data;

    const newOrders = await PurchaseOrders.create({
      addresses_name,
      address,
      postalcode,
      phone,
      quantity,
      total_price,
      status,
      parcel_number,
      user_id,
      product_id,
      receipt_id,
    });

    res.status(201).json({ message: 'Succeed', status: 'ok', PurchaseOrders: newOrders });
  } catch (error) {
    next(error);
  }
});

router.post('/search/userId', async (req, res, next) => {
  const { user_id } = req.body;
  console.log(user_id);
  try {
    const orders = await PurchaseOrders.findAll({
      where: {
        user_id: user_id,
      },
    });

    res.status(200).json({ message: 'Success', status: 'ok', orders });
  } catch (error) {
    next(error);
  }
});

router.post('/search/Id', async (req, res, next) => {
  const { id } = req.body;
  console.log(id);
  try {
    const orders = await PurchaseOrders.findAll({
      where: {
        id: id,
      },
    });

    res.status(200).json({ message: 'Success', status: 'ok', orders });
  } catch (error) {
    next(error);
  }
});

router.post('/search', async (req, res, next) => {
  try {
    const { Id } = req.body;

    if (!Id) {
      res.status(400).json({ message: 'กรุณาระบุ id ' });
      return;
    }

    const orders = await PurchaseOrders.findByPk(Id, {
      include: [
        { model: Product },
        { model: Users },
        { model: Receipt },
      ]
    });

    if (!orders) {
      res.status(404).json({ message: 'ไม่พบ id ที่ระบุ' });
      return;
    }

    res.json(orders);
  } catch (error) {
    next(error);
  }
});

router.post('/search/all', async (req, res, next) => {
  try {
    const products = await PurchaseOrders.findAll({
      include: [
        { model: Product },
        { model: Users },
        { model: Receipt },
      ]
    });
    res.json(products);
  } catch (error) {
    next(error);
  }
});

router.post('/edit', async (req, res, next) => {
  try {
    const ordersId = req.body.id;
    const data = req.body;

    if (!ordersId || Object.keys(data).length === 0) {
      return res.status(400).json({ message: 'Invalid update data' });
    }

    const updatedOrders = await PurchaseOrders.update(data, {
      where: { id: ordersId }
    });

    if (updatedOrders[0] === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Update successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Update error' });
  }
});

module.exports = router;