const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Category = require('./categoria');

// Definição do modelo de Produto
const Product = sequelize.define('Product', {
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

// Relacionamento com a Categoria
Product.belongsTo(Category, { foreignKey: 'categoryId', onDelete: 'SET NULL' });
Category.hasMany(Product, { foreignKey: 'categoryId' });

// Hook para atualizar o estoque após a venda
Product.afterUpdate(async (product, options) => {
    if (options.fields.includes('stock')) {
        const updatedProduct = await Product.findByPk(product.id);
        if (updatedProduct.stock < 0) {
            throw new Error('Estoque não pode ser negativo');
        }
    }
});

module.exports = Product;
