const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});
pool.connect(function (err) {
  if (err) {
    console.error('Error connecting to PostgreSQL database: ' + err.stack);
    return;
  }
  console.log('Connected to PostgreSQL database');
});

module.exports = { pool };