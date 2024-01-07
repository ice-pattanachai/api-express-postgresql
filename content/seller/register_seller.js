require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('../../database/db');
const bodyParser = require('body-parser');
const validation = require('../verify');
const { Seller } = require('../../database/models');
const jsonParser = bodyParser.json();
const saltRounds = 12;

// router.post('/', jsonParser, function (req, res, next) {
//   if (validation.containsDisallowedSql(req.body.username)) {
//     res.json({ status: 'error', message: 'Username contains disallowed SQL commands' });
//     return;
//   }

//   if (validation.containsDisallowedSql(req.body.password_hash)) {
//     res.json({ status: 'error', message: 'Password contains disallowed SQL commands' });
//     return;
//   }

//   if (!validation.isPasswordValid(req.body.password_hash)) {
//     res.json({ status: 'error', message: 'Password must be at least 8 characters long' });
//     return;
//   }

//   if (!validation.isPasswordComplex(req.body.password_hash)) {
//     res.json({
//       status: 'error',
//       message: 'Password must contain at least one digit, one letter, and one special character.'
//     });
//     return;
//   }

//   db.pool.query(
//     'SELECT * FROM "LittleShopFront"."admin" WHERE username = $1',
//     [req.body.username],
//     function (err, results, fields) {
//       if (err) {
//         res.json({ status: 'error', message: err });
//         return;
//       }

//       if (results.rows.length > 0) {
//         res.json({ status: 'error', message: 'This username already exists!' });
//         return;
//       }

//       bcrypt.hash(req.body.password_hash, saltRounds, function (err, hash) {
//         if (err) {
//           res.json({ status: 'error', message: err });
//           return;
//         }

//         db.pool.query(
//           'INSERT INTO "LittleShopFront"."admin"(username, password_hash, name) VALUES ($1, $2, $3)',
//           [req.body.username, hash, req.body.name],
//           function (err, results, fields) {
//             if (err) {
//               res.json({ status: 'error', message: err });
//               return;
//             }
//             res.json({ status: 'ok' });
//           }
//         );
//       });
//     }
//   );
// });

router.post('/', async (req, res, next) => {
  const data = req.body;
  try {
    const { username, password_hash, name } = data;
    if (!username || !password_hash || !name) {
      res.status(400).json({ message: 'Incomplete information. Please proceed again.' });
      return;
    }

    if (validation.containsDisallowedSql(username)) {
      res.json({ status: 'error', message: 'Username contains disallowed SQL commands' });
      return;
    }

    if (validation.containsDisallowedSql(password_hash)) {
      res.json({ status: 'error', message: 'Password contains disallowed SQL commands' });
      return;
    }

    if (!validation.isPasswordValid(password_hash)) {
      res.json({ status: 'error', message: 'Password must be at least 8 characters long' });
      return;
    }

    const hash = await bcrypt.hash(req.body.password_hash, saltRounds);

    const newSeller = await Seller.create({
      username,
      password_hash: hash,
      name,
    });

    res.status(201).json({ message: 'Succeed', status: 'ok', Seller: newSeller });
  } catch (error) {
    next(error);
  }
});

module.exports = router;