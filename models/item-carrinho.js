const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Product = require('./produto');  // Certifique-se de que o caminho está correto
const User = require('./user');    // Certifique-se de que o caminho está correto

// Definição do modelo de ItemCarrinho
const CartItem = sequelize.define('CartItem', {
    idCartItem: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1, // A quantidade deve ser ao menos 1
        },
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    userId: { // A coluna 'userId' precisa ser definida aqui
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    productId: { // Certifique-se que a chave estrangeira de produto está definida corretamente
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

module.exports = CartItem;
