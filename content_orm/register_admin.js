const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize');

const Admin = sequelize.define('admin', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  schema: 'LittleShopFront',
});

module.exports = Admin;