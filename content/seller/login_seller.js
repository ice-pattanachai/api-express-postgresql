require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const db = require('../../database/db');
const validation = require('../verify');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const secret = process.env.ENCRYPT;

router.post('/', jsonParser, function (req, res, next) {
  if (validation.containsDisallowedSql(req.body.username)) {
    res.json({ status: 'error', message: 'Username contains disallowed SQL commands' });
    return;
  }

  if (validation.containsDisallowedSql(req.body.password_hash)) {
    res.json({ status: 'error', message: 'Password contains disallowed SQL commands' });
    return;
  }

  db.pool.query(
    'SELECT * FROM "LittleShopFront"."admin" WHERE username=$1',
    [req.body.username],
    function (err, result) {
      if (err) {
        return res.json({ status: 'error', message: err });
      }
      if (!result.rows || result.rows.length === 0) {
        return res.json({ status: 'error', message: 'No user found' });
      }
      const user = result.rows[0];
      bcrypt.compare(req.body.password_hash, user.password_hash, function (err, isLogin) {
        if (isLogin) {
          const token = jwt.sign({ username: user.username }, secret, {
            expiresIn: '1h'
          });
          console.log('Login success:' +'  '+req.body.username +'  '+ ':admin');
          return res.json({ status: 'ok', message: 'Login success', token });
        } else {
          return res.json({ status: 'error', message: 'Login failed' });
        }
      });
    }
  );
});

module.exports = router;