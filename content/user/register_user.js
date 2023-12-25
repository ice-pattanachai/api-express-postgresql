require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('../../database/db');
const validation = require('../verify');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const saltRounds = 12;

router.post('/', jsonParser, function (req, res, next) {
  if (validation.containsDisallowedSql(req.body.username)) {
    res.json({ status: 'error', message: 'Username contains disallowed SQL commands' });
    return;
  }

  if (validation.containsDisallowedSql(req.body.password_hash)) {
    res.json({ status: 'error', message: 'Password contains disallowed SQL commands' });
    return;
  }

  if (!validation.isPasswordValid(req.body.password_hash)) {
    res.json({ status: 'error', message: 'Password must be at least 8 characters long' });
    return;
  }

  if (!validation.isPasswordComplex(req.body.password_hash)) {
    res.json({
      status: 'error',
      message: 'Password must contain at least one digit, one letter, and one special character.'
    });
    return;
  }

  db.pool.query(
    'SELECT * FROM "LittleShopFront"."users" WHERE username = $1',
    [req.body.username],
    function (err, results, fields) {
      if (err) {
        res.json({ status: 'error', message: err });
        return;
      }

      if (results.rows.length > 0) {
        res.json({ status: 'error', message: 'This name is already in use.' });
        return;
      }
  
      bcrypt.hash(req.body.password_hash, saltRounds, function (err, hash) {
        if (err) {
          res.json({ status: 'error', message: err });
          return;
        }

        db.pool.query(
          'INSERT INTO "LittleShopFront"."users"("username", "password_hash", "mail", "roles_id_roles") VALUES ($1, $2, $3, 2)',
        [req.body.username, hash, req.body.mail,],
          function (err, results, fields) {
            if (err) {
              res.json({ status: 'error', message: err });
              return;
            }
            res.json({ status: 'ok' });
          }
        );
      });
    }
  );
});

module.exports = router;