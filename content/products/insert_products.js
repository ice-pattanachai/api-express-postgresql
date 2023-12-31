const express = require('express');
const router = express.Router();
const db = require('../../database/db');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: './images',
    filename: function (req, file, cb) {
        const originalFileName = file.originalname;
        const time = Date.now().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' });
        cb(null, originalFileName, time);
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

router.post('/', function (req, res) {
    upload(req, res, (err) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        } else {
            const {
                product_name,
                description,
                product_status,
                price_per_piece,
                stock_quantity,
                category_name,
                dscription,
                products_product_id,
                products_id_pk,
                number,
                path,
                code_promotion,
                percent,
                time_percent,
            } = req.body;


            // INSERT INTO products
            const productSql = `
                INSERT INTO "LittleShopFront".products (
                    product_name,
                    description, 
                    product_status, 
                    price_per_piece, 
                    stock_quantity
                    )
                VALUES ($1 , $2 , $3 , $4 , $5);
            `;

            // INSERT INTO categories
            const categoriesSql = `
                INSERT INTO "LittleShopFront".categories (
                    category_name, 
                    dscription,
                    products_product_id
                    )
                VALUES ($1 , $2 , $3);
            `;

            // INSERT INTO images
            const imagesSql = `
                INSERT INTO "LittleShopFront".images (
                    products_id_pk, 
                    number,
                    path
                    )
                VALUES ($1 , $2 , $3);
            `;

            // INSERT INTO promotion
            const promotionSql = `
                INSERT INTO "LittleShopFront".promotion (
                    products_product_id, 
                    code_promotion,
                    percent,
                    time_percent
                    )
                VALUES ($1 , $2 , $3 , $4);
            `;

            db.pool.query(productSql, [
                req.body.product_name,
                req.body.description,
                req.body.product_status,
                req.body.price_per_piece,
                req.body.stock_quantity
            ], (error, productResult) => {
                if (error) {
                    console.error(error);
                    res.sendStatus(500);
                } else {
                    const productId = productResult.insertId;

                    // เพิ่มข้อมูลลงในตาราง categories
                    db.pool.query(categoriesSql, [
                        req.body.category_name,
                        req.body.dscription,
                        req.body.products_product_id
                    ], (error, categoriesResult) => {
                        if (error) {
                            console.error(error);
                            res.sendStatus(500);
                        } else {
                            // เพิ่มข้อมูลลงในตาราง images
                            db.pool.query(imagesSql, [
                                req.body.products_id_pk,
                                req.body.number,
                                // req.body.path
                                req.file.filename
                            ], (error, imagesResult) => {
                                if (error) {
                                    console.error(error);
                                    res.sendStatus(500);
                                } else {
                                    // เพิ่มข้อมูลลงในตาราง promotion
                                    db.pool.query(promotionSql, [
                                        req.body.products_product_id,
                                        req.body.code_promotion,
                                        req.body.percent,
                                        req.body.time_percent
                                    ], (error, promotionResult) => {
                                        if (error) {
                                            console.error(error);
                                            res.sendStatus(500);
                                        } else {
                                            console.log('Data inserted successfully');
                                            res.sendStatus(200);
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

module.exports = router;
