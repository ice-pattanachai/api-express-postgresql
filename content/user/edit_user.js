const express = require('express');
const router = express.Router();
const { Users } = require('../../database/models');
const bcrypt = require('bcrypt'); // นำเข้า bcrypt เพื่อให้สามารถใช้ hash รหัสผ่านได้
const validation = require('../verify');
const saltRounds = 12;

router.post('/', async (req, res, next) => {
    try {
        const userId = req.body.id;
        const data = req.body;

        if (!userId || Object.keys(data).length === 0) {
            return res.status(400).json({ message: 'Invalid update data' });
        }

        // ตรวจสอบการเปลี่ยนแปลงของรหัสผ่าน
        if (data.password_hash) {
            data.password_hash = await bcrypt.hash(data.password_hash, saltRounds);
        }

        const updatedUser = await Users.update(data, {
            where: { id: userId }
        });

        if (updatedUser[0] === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'Update successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Update error' });
    }
});

module.exports = router;
