const express = require('express');
const router = express.Router();
const { Product, Images, Categories } = require('../../database/models');

router.post('/', async (req, res, next) => {
    const data = req.body;
    try {
        const {
            product_name,
            description,
            product_status,
            price_per_piece,
            stock_quantity,
            images,
            categories,
        } = data;
        if (
            !product_name ||
            !description ||
            !product_status ||
            !price_per_piece ||
            !stock_quantity ||
            !images ||
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

        const imagesData = images.map(image => ({
            number: image.number,
            path: image.path,
            product_id: newProduct.id,
        }));
        await Images.bulkCreate(imagesData);

        const categoriesData = categories.map(category => ({
            category_name: category.category_name,
            description: category.description,
            product_id: newProduct.id,
        }));
        await Categories.bulkCreate(categoriesData);

        res.status(201).json({
            message: 'Succeed',
            status: 'ok',
            product: newProduct,
            images: imagesData,
            categories: categoriesData
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;