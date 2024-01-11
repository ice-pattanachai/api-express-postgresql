const express = require('express');
const router = express.Router();
const db = require('../database/db');

router.post('/', function (req, res) {
  db.pool.query('SELECT * FROM "LittleShopFront"."users"', (error, results, fields) => {
    if (error) throw error;
    res.send(results);
  });
});

module.exports = router;
