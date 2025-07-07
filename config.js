const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const sequelize = new Sequelize('fixit', 'root', 'cS4FJ?', {
  host: 'localhost',
  dialect: 'mysql',
});

const User = sequelize.define('User', {
  username: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('user', 'admin'), allowNull: false },
});

const Place = sequelize.define('Place', {
  name: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.STRING, allowNull: false },
  latitude: { type: DataTypes.DECIMAL, allowNull: false },
  longitude: { type: DataTypes.DECIMAL, allowNull: false },
  address: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
});

sequelize.sync();