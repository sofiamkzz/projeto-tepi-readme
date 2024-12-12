const CartItem = require('../models/cartItem');
const Product = require('../models/product');

const getCart = async (req, res) => {
    try {
        const userId = req.session.userId;

        if (!userId) {
            return res.redirect('/login'); 
        }

        const cartItems = await CartItem.findAll({
            where: { userId },
            include: [Product]
        });

        const total = cartItems.reduce((acc, item) => acc + (item.quantity * item.price), 0);

        console.log(cartItems);

        res.render('carrinho', { cartItems, total: total.toFixed(2) });
    } catch (error) {
        console.error(error);
        res.render('carrinho', { mensagem: 'Erro ao carregar o carrinho.', cartItems: [] });
    }
};

const addToCart = async (req, res) => {
    const productId = req.params.id; 
    const quantity = 1;
    const userId = req.session.userId;

    if (!userId) {
        return res.redirect('/login'); 
    }

    try {
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.redirect('/carrinho'); 
        }

        if (product.stock < quantity) {
            return res.redirect('/carrinho?mensagem=Estoque insuficiente');  // Não há estoque suficiente
        }

        const existingItem = await CartItem.findOne({ where: { userId, productId } });

        if (existingItem) {
            existingItem.quantity += quantity;
            await existingItem.save();
        } else {
            await CartItem.create({
                userId,
                productId,
                quantity,
                price: product.price
            });
        }

        const cartItems = await CartItem.findAll({
            where: { userId },
            include: [Product]
        });

        const total = cartItems.reduce((acc, item) => acc + (item.quantity * item.price), 0);

        console.log(cartItems)

        res.render('carrinho', { cartItems, total: total.toFixed(2) });
    } catch (error) {
        console.error(error);
        res.render('carrinho', { mensagem: 'Erro ao adicionar item ao carrinho.', cartItems: [] });
    }
};

const removeFromCart = async (req, res) => {
    const cartItemId = req.params.id;

    try {
        await CartItem.destroy({ where: { id: cartItemId } });
        res.redirect('/carrinho');
    } catch (error) {
        console.error(error);
        res.render('carrinho', { mensagem: 'Erro ao remover item do carrinho.' });
    }
};

module.exports = {
    getCart,
    addToCart,
    removeFromCart
};
