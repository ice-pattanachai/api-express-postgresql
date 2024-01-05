require('dotenv').config();
const express = require('express');
const router = express.Router();
const db = require('../database/db');
const bodyParser = require('body-parser');
const { Roles } = require('../database/models');
const jsonParser = bodyParser.json();


// router.post('/', jsonParser, function (req, res, next) {

//   db.pool.query(
//     'SELECT * FROM "LittleShopFront"."roles" WHERE role_name = $1',
//     [req.body.role_name],
//     function (err, results, fields) {
//       if (err) {
//         res.json({ status: 'error', message: err });
//         return;
//       }

//       if (results.rows.length > 0) {
//         res.json({ status: 'error', message: 'This name is already in use.' });
//         return;
//       }

//       db.pool.query(
//         'INSERT INTO "LittleShopFront"."roles"("role_name") VALUES ($1)',
//         [req.body.role_name],
//         function (err, results) {
//           if (err) {
//             res.json({ status: 'error', message: err });
//             return;
//           }
//           res.json({ status: 'ok' });
//         }
//       );
//     });
// });

router.post('/', async (req, res, next) => {
  const data = req.body;
  try {
    const { role_name } = data;
    if (!role_name) {
      res.status(400).json({ message: 'Incomplete information. Please proceed again.' });
      return;
    }
    const newRoles = await Roles.create({
      role_name
    });

    res.status(201).json({ message: 'Succeed', status: 'ok', Roles: newRoles });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

// req.body.createdAt = new DataTransfer(), req.body.updatedAt = new DataTransfer()