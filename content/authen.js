require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const secret = process.env.ENCRYPT;
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

router.post('/', jsonParser, function (req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    var decoded = jwt.verify(token, secret);
    res.json({ status: 'ok', decoded, token: req.headers.authorization});
  } catch (err) {
    res.json({ status: 'error', message: err.message });
  }
});

module.exports = router;