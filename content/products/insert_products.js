const multer = require('multer');
const express = require('express');
const router = express.Router();
const { Product, Images, Categories } = require('../../database/models');

const storage = multer.diskStorage({
    destination: './content/image',
    filename: function (req, file, cb) {
        const originalFileName = file.originalname;
        const time = new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' });
        // const formattedTime = time.replace(/[:/\\]/g, ''); // ลบตัวอักษรพิเศษที่ไม่สามารถใช้ในชื่อไฟล์ได้
        const uniqueString = Date.now().toString(36) + Math.random().toString(36).substring(2);
        const fileNameWithoutSpaces = (uniqueString + '_' + originalFileName).replace(/\s/g, '');
        // cb(null, uniqueString + '_' + originalFileName , time);
        cb(null, fileNameWithoutSpaces, time);
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
}).single('image');

router.post('/', async (req, res, next) => {
    // const data = req.body;
    try {
        upload(req, res, async function (err) {
            if (err) {
                return res.status(400).json({ message: err.message });
            }

            const data = req.body;
            const file = req.file;

            const {
                product_name,
                description,
                product_status,
                price_per_piece,
                stock_quantity,
                categories,
            } = data;

            if (
                !product_name ||
                !description ||
                !product_status ||
                !price_per_piece ||
                !stock_quantity ||
                !file ||
                !categories
            ) {
                res.status(400).json({ message: 'Incomplete information. Please proceed again.' });
                return;
            }

            const newProduct = await Product.create({
                product_name,
                description,
                product_status,
                price_per_piece,
                stock_quantity,
            });

            const imageInfo = {
                number: 1, // Adjust as needed
                path: file.path,
                product_id: newProduct.id,
            };

            const imagesData = [imageInfo];
            await Images.bulkCreate(imagesData);

            // const categoriesData = categories.map(category => ({
            //     category_name: category.category_name,
            //     description: category.description,
            //     product_id: newProduct.id,
            // }));
            // await Categories.bulkCreate(categoriesData);

            // res.status(201).json({
            //     message: 'Succeed',
            //     status: 'ok',
            //     product: newProduct,
            //     images: imagesData,
            //     categories: categoriesData
            // });
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;