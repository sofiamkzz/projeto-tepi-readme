const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');
const Cart = require('./cart');
const Donation = require('./donation');  

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
    allowNull: false,
  },
  cartId: {
    type: DataTypes.INTEGER,
    references: {
      model: Cart,
      key: 'id',
    },
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'shipped', 'canceled'),
    defaultValue: 'pending',
  },
  totalValue: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  paymentMethod: {
    type: DataTypes.STRING,
  },
  address: {
    type: DataTypes.STRING,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  }
});

Order.belongsTo(User, { foreignKey: 'userId' });
Order.belongsTo(Cart, { foreignKey: 'cartId' });
Order.hasMany(Donation, { foreignKey: 'orderId' });

module.exports = Order;
