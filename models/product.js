const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,  
  },
  description: {
    type: DataTypes.TEXT,  
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,  
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  imageUrl: {
      type: DataTypes.STRING,
        allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,  
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,  
  }
}, {
  timestamps: true, 
});

module.exports = Product;
