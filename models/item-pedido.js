const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Product = require('./produto');
const Order = require('./pedido');

// Definição do modelo de ItemPedido
const OrderItem = sequelize.define('OrderItem', {
  idOrderItem: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  totalPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

module.exports = OrderItem;
