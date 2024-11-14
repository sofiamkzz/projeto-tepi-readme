const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Product = require('./produto');  // Adjust the path based on your folder structure

// Definição do modelo de Carrinho
const Cart = sequelize.define('Cart', {
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

// Relacionamento com o Usuário
Cart.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasOne(Cart, { foreignKey: 'userId' });

// Relacionamento com o Produto (para adicionar itens ao carrinho)
Cart.belongsToMany(Product, { through: 'CartItem', foreignKey: 'cartId' });
Product.belongsToMany(Cart, { through: 'CartItem', foreignKey: 'productId' });

module.exports = Cart;