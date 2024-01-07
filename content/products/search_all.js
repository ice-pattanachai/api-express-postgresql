const express = require('express');
const router = express.Router();
const { Product, Images, Categories, Promotion } = require('../../database/models');
const path = require('path');

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


router.get('/image', async (req, res) => {
    try {
        const imageId = req.query.product_id;
        const image = await Images.findOne({ where: { id: imageId } });
        if (!image) {
            return res.status(404).json({ message: 'Image not found' });
        }
        const imageFolderPath = '../';
        const imagePath = path.join(__dirname, '..', imageFolderPath, decodeURIComponent(image.path));

        console.log(imagePath); // พิมพ์ที่อยู่ไฟล์ใน console เพื่อตรวจสอบ
        res.sendFile(imagePath);
    } catch (error) {
        console.log(error); // พิมพ์ข้อผิดพลาดใน console เพื่อตรวจสอบ
        if (error.name === 'SequelizeConnectionError') {
            return res.status(500).json({ message: 'Database connection error' });
        }

        if (error.code === 'ENOENT') {
            return res.status(404).json({ message: 'File not found' });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = router;