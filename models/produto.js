const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
    idProduct: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    },
});

Product.afterUpdate(async (product, options) => {
    if (options.fields.includes('stock')) {
        const updatedProduct = await Product.findByPk(product.id);
        if (updatedProduct.stock < 0) {
            throw new Error('Estoque não pode ser negativo');
        }
    }
});

module.exports = Product;