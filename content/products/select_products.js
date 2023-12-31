const express = require('express');
const router = express.Router();
const db = require('../../database/db');

router.post('/', function (req, res) {
  db.pool.query(`
  SELECT * 
  FROM "LittleShopFront".products
  INNER JOIN "LittleShopFront".categories ON products.product_id = categories.products_product_id
  INNER JOIN "LittleShopFront".images ON products.product_id = images.products_id_pk
  INNER JOIN "LittleShopFront".promotion ON products.product_id = promotion.products_product_id
`, (error, results, fields) => {
    if (error) throw error;
    res.send(results);
  });
});

module.exports = router;
