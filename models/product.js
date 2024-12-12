const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const CartItem = require('./cartItem');
const Category = require('./category');  

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
  categoryId: {
    type: DataTypes.INTEGER,
    references: {
      model: Category, 
      key: 'id',        
    },
    allowNull: false,  
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

Product.hasMany(CartItem, { foreignKey: 'productId' });
Product.belongsTo(Category, { foreignKey: 'categoryId' }); 

module.exports = Product;
