const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Product = require('./product');

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,  // A categoria precisa ser única
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  }
}, {
  timestamps: true,
});

Category.hasMany(Product, { foreignKey: 'categoryId' });
Product.belongsTo(Category, { foreignKey: 'categoryId' });

module.exports = Category;
