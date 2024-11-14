const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Category = require('./categoria');

// Definição do modelo de Produto
const Product = sequelize.define('Product', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

// Relacionamento com a Categoria
Product.belongsTo(Category, { foreignKey: 'categoryId', onDelete: 'SET NULL' });
Category.hasMany(Product, { foreignKey: 'categoryId' });

module.exports = Product;