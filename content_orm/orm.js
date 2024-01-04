const express = require('express');
const router = express.Router();
const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../database/sequelize');

const Product = sequelize.define('product', {
    product_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    product_status: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    price_per_piece: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    stock_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
}, { schema: 'LittleShopFront', }
);

const Categories = sequelize.define('categories', {
    category_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, { schema: 'LittleShopFront', })

const Images = sequelize.define('images', {
    number: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    path: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, { schema: 'LittleShopFront', })

const Promotion = sequelize.define('promotion', {
    code_promotion: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    percent: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    time_percent: {
        type: DataTypes.TIME,
        allowNull: false,
    },
}, { schema: 'LittleShopFront', })

Product.hasMany(Categories, { foreignKey: 'products_product_id', targetKey: 'product_id' })
Categories.belongsTo(Product, { foreignKey: 'products_product_id', sourceKey: 'product_id' })

Product.hasMany(Images, { foreignKey: 'products_id_pk', targetKey: 'product_id' })
Images.belongsTo(Product, { foreignKey: 'products_id_pk', sourceKey: 'product_id' })

Product.hasMany(Promotion, { foreignKey: 'products_product_id', targetKey: 'product_id' })
Promotion.belongsTo(Product, { foreignKey: 'products_product_id', sourceKey: 'product_id' })


router.get('/get', async (req, res) => {
    try {
        const getProduct = await Product.findAll()
        res.json(getProduct)
    } catch (error) {
        console.log(error)
        res.json(error)
    }
});

router.post('/post', async (req, res, next) => {
    const data = req.body;
    try {
        const { product_name, description, product_status, price_per_piece, stock_quantity } = data
        // const { product_name, description, product_status, price_per_piece, stock_quantity } = req.body;
        if (!product_name || !description || !product_status || !price_per_piece || !stock_quantity) {
            res.status(400).json({ message: 'ข้อมูลไม่ครบถ้วน กรุณาระบุข้อมูลผลิตภัณฑ์ให้ครบ' });
            return;
        }
        const newProduct = await Product.create({
            product_name,
            description,
            product_status,
            price_per_piece,
            stock_quantity,
        });

        res.status(201).json({ message: 'เพิ่มผลิตภัณฑ์สำเร็จ', product: newProduct });
    } catch (error) {
        next(error);
    }
});

module.exports = router;