const multer = require('multer');
const express = require('express');
const router = express.Router();
const { Set, Addresses_Shop } = require('../../database/models');
const path = require('path');
const { verifyToken } = require('../verify')

router.get('/image', async (req, res) => {
    try {
        const imageId = req.query.id;
        const image = await Set.findOne({ where: { id: imageId } });
        if (!image) {
            return res.status(404).json({ message: 'Image not found' });
        }
        const imageFolderPath = '../';
        const imagePath = path.join(__dirname, '..', imageFolderPath, decodeURIComponent(image.img_promptpay_path));

        console.log(imagePath);
        res.sendFile(imagePath);
    } catch (error) {
        console.log(error);
        if (error.name === 'SequelizeConnectionError') {
            return res.status(500).json({ message: 'Database connection error' });
        }

        if (error.code === 'ENOENT') {
            return res.status(404).json({ message: 'File not found' });
        }
        res.status(500).json({ message: 'Internal server error', statusCode: 500 });
    }
});

const storage = multer.diskStorage({
    destination: './content/image_PromptpayQR',
    filename: function (req, file, cb) {
        const originalFileName = file.originalname;
        const uniqueString = Date.now().toString(36) + Math.random().toString(36).substring(2);
        const fileNameWithoutSpaces = (uniqueString + '_' + originalFileName).replace(/\s/g, '');
        cb(null, fileNameWithoutSpaces);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF|webp|WEBP)$/)) {
            req.fileValidationError = 'Only image files are allowed!';
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    },
}).single('img_promptpay_path');

router.post('/add', async (req, res, next) => {
    try {
        upload(req, res, async function (err) {
            if (err) {
                return res.status(400).json({ message: err.message });
            }
            if (!req.body.shopname || !req.body.shoptax || !req.file) {
                return res.status(400).json({ message: "All fields are required." });
            }

            const { shopname, shoptax } = req.body;
            const file = req.file;

            const newShop = await Set.create({
                shopname,
                shoptax,
                img_promptpay_path: file.path
            });

            return res.status(200).json({ message: "Shop added successfully." });
        });
    } catch (error) {
        next(error);
    }
});

router.post('/add/addresses', async (req, res, next) => {
    const data = req.body;
    try {
        const { fullname, address, postalcode, phone, shop_id } = data;

        if (!fullname || !address || !postalcode || !phone || !shop_id) {
            res.status(400).json({ message: 'Incomplete information. Please proceed again.' });
            return;
        }

        const newAddresses = await Addresses_Shop.create({
            fullname,
            address,
            postalcode,
            phone,
            shop_id,
        });

        res.status(201).json({ message: 'Succeed', status: 'ok', Seller: newAddresses });
    } catch (error) {
        next(error);
    }
});

router.post('/edit/addresses', async (req, res, next) => {
    try {
        const addressesId = req.body.id;
        const data = req.body;

        if (!addressesId || Object.keys(data).length === 0) {
            return res.status(400).json({ message: 'Invalid update data' });
        }

        const updatedProduct = await Addresses_Shop.update(data, {
            where: { id: addressesId }
        });

        if (updatedProduct[0] === 0) {
            return res.status(404).json({ message: 'addresses not found' });
        }

        res.status(200).json({ message: 'Update successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Update error' });
    }
});


module.exports = router;