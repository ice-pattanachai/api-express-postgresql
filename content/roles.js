require('dotenv').config();
const express = require('express');
const router = express.Router();
const db = require('../database/db');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


router.post('/', jsonParser, function (req, res, next) {
  
  db.pool.query(
    'SELECT * FROM "LittleShopFront"."roles" WHERE role_name = $1',
    [req.body.role_name],
    function (err, results, fields) {
      if (err) {
        res.json({ status: 'error', message: err });
        return;
      }

      if (results.rows.length > 0) {
        res.json({ status: 'error', message: 'This name is already in use.' });
        return;
      }

      db.pool.query(
        'INSERT INTO "LittleShopFront"."roles"("role_name") VALUES ($1)',
        [req.body.role_name],
        function (err, results) {
          if (err) {
            res.json({ status: 'error', message: err });
            return;
          }
        res.json({ status: 'ok' });
      }
    );
  }); 
});

module.exports = router;