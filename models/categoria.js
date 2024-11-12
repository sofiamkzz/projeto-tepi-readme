const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Definição do modelo de Categoria
const Category = sequelize.define('Category', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

module.exports = Category;