const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');
const Product = require('./produto');

// Definição do modelo de Favorito
const Favorite = sequelize.define('Favorite', {
    idFavorite: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    }
});

// Relacionamentos
User.belongsToMany(Product, { through: Favorite, foreignKey: 'userId' });
Product.belongsToMany(User, { through: Favorite, foreignKey: 'productId' });

module.exports = Favorite;
