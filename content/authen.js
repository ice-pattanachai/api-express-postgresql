require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const secret = process.env.ENCRYPT;
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

router.post('/', jsonParser, function (req, res, next) {
  try {
    if (req.headers.authorization && req.headers.authorization !== 'undefined') {
      const token = req.headers.authorization.split(' ')[1];
      var decoded = jwt.verify(token, secret);
      console.log('|Authen username = ' + decoded.username + '| ' + '|Roles = ' + decoded.roles + '| ');
      res.json({ status: 'ok', decoded, token: req.headers.authorization });
    } else {
      throw new Error('Authorization header is missing or undefined')
    }

  } catch (err) {
    res.json({ status: 'error', message: err.message });
  }
});

module.exports = router;