const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Product = require('./produto'); 
const User = require('./user');

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
            min: 1,
        },
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    userId: { 
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

module.exports = CartItem;