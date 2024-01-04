const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});
sequelize
  .authenticate()
  .then(() => {
    console.log('Connected to Sequelize PostgreSQL database');
  })
  .catch((err) => {
    console.error('Error connecting to Sequelize PostgreSQL database:', err);
  });


module.exports = sequelize;