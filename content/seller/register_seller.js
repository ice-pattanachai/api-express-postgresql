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