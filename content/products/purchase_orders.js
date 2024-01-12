require('dotenv').config();
const express = require('express');
const router = express.Router();
const { PurchaseOrders, Product, Users } = require('../../database/models');

router.post('/add', async (req, res, next) => {
  const data = req.body;

  try {
    const {
      addresses_name, address, postalcode, phone, quantity, total_price, status, payment_format, confirm_payment, user_id, product_id,
    } = data;

    if (!addresses_name || !address || !postalcode || !phone || !quantity || !total_price || !status || !payment_format || !confirm_payment || !user_id || !product_id) {
      res.status(400).json({ message: 'Incomplete information. Please proceed again.' });
      return;
    }

    const newOrders = await PurchaseOrders.create({
      addresses_name,
      address,
      postalcode,
      phone,
      quantity,
      total_price,
      status,
      payment_format,
      confirm_payment,
      user_id,
      product_id,
    });

    res.status(201).json({ message: 'Succeed', status: 'ok', PurchaseOrders: newOrders });
  } catch (error) {
    next(error);
  }
});

router.post('/search', async (req, res, next) => {
  try {
    const { Id } = req.body;

    if (!Id) {
      res.status(400).json({ message: 'กรุณาระบุ id ของสินค้าที่ต้องการค้นหา' });
      return;
    }

    const orders = await PurchaseOrders.findByPk(Id, {
      include: [
        { model: Product },
        { model: Users },
      ]
    });

    if (!orders) {
      res.status(404).json({ message: 'ไม่พบสินค้าที่มี id ที่ระบุ' });
      return;
    }

    res.json(orders);
  } catch (error) {
    next(error);
  }
});

router.post('/edit', async (req, res, next) => {
  try {
    const ordersId = req.body.id;
    const data = req.body;

    // ตรวจสอบว่า req.body มีข้อมูลที่จำเป็นที่จะทำการอัปเดตหรือไม่
    if (!ordersId || Object.keys(data).length === 0) {
      return res.status(400).json({ message: 'Invalid update data' });
    }

    // ทำการอัปเดตข้อมูล
    const updatedOrders = await PurchaseOrders.update(data, {
      where: { id: ordersId }
    });

    // ตรวจสอบว่ามีข้อมูลถูกอัปเดตหรือไม่
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