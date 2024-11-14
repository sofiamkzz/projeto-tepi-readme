const CartItem = require('../models/item-carrinho');
const Product = require('../models/produto');

// Exibir o carrinho de compras
const getCart = async (req, res) => {
    try {
        const userId = req.session.userId;

        if (!userId) {
            return res.redirect('/login'); // Caso o usuário não esteja logado
        }

        const cartItems = await CartItem.findAll({
            where: { userId },
            include: [Product] // Inclui os detalhes do produto
        });

        const total = cartItems.reduce((acc, item) => acc + (item.quantity * item.price), 0);

        res.render('carrinho', {
            cartItems,
            total: total.toFixed(2)
        });
    } catch (error) {
        console.error(error);
        res.render('carrinho', { mensagem: 'Erro ao carregar o carrinho.' });
    }
};

// Adicionar item ao carrinho
const addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.session.userId;

    if (!userId) {
        return res.redirect('/login');
    }

    try {
        const existingItem = await CartItem.findOne({ where: { userId, productId } });

        if (existingItem) {
            existingItem.quantity += quantity;
            await existingItem.save();
        } else {
            const product = await Product.findByPk(productId);
            await CartItem.create({
                userId,
                productId,
                quantity,
                price: product.price
            });
        }

        res.redirect('/carrinho');
    } catch (error) {
        console.error(error);
        res.redirect('/carrinho');
    }
};

// Remover item do carrinho
const removeFromCart = async (req, res) => {
    const { cartItemId } = req.params;

    try {
        await CartItem.destroy({ where: { id: cartItemId } });
        res.redirect('/carrinho');
    } catch (error) {
        console.error(error);
        res.redirect('/carrinho');
    }
};

module.exports = {
    getCart,
    addToCart,
    removeFromCart
};