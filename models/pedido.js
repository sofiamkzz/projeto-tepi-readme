const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

// Definição do modelo de Pedido
const Order = sequelize.define('Order', {
  idOrder: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Pendente', // Ex: Pendente, Enviado, Concluído, etc.
  },
  totalAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = Order;
