const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');
const Product = require('./produto');

// Definição do modelo de Favorito
const Favorite = sequelize.define('Favorite', {
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    }
});

// Relacionamentos
// Um usuário pode ter vários favoritos
User.belongsToMany(Product, { through: Favorite, foreignKey: 'userId' });
Product.belongsToMany(User, { through: Favorite, foreignKey: 'productId' });

module.exports = Favorite;
