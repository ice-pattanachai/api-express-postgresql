const express = require('express');
const router = express.Router();
const { Users, Addresses } = require('../../database/models');

router.post('/', async (req, res, next) => {
    const { id } = req.body;
    try {
        if (!id) {
            res.status(400).json({ message: 'กรุณาระบุ id ของ User' });
            return;
        }
        const user = await Users.findByPk(id, {
            include: [
                { model: Addresses },
            ]
        });
        if (!user) {
            res.status(404).json({ message: 'ไม่พบ User ที่มี id ที่ระบุ' });
            return;
        }
        res.json(user);
    } catch (error) {
        next(error);
    }
});

module.exports = router;