require('dotenv').config();
const express = require('express');
const router = express.Router();
const db = require('../database/db');
const bodyParser = require('body-parser');
const { Roles } = require('../database/models');
const jsonParser = bodyParser.json();

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