const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user'); 
const Order = require('./order'); 

const Donation = sequelize.define('Donation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  message: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('Pendente', 'Finalizado', 'Cancelado'),
    defaultValue: 'Pendente',
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

Donation.belongsTo(User, { foreignKey: 'userId' }); 
Donation.belongsTo(Order, { foreignKey: 'orderId' }); 

module.exports = Donation;
