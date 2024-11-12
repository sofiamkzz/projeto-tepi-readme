const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Definição do modelo de Itens do Carrinho
const CartItem = sequelize.define('CartItem', {
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = CartItem;