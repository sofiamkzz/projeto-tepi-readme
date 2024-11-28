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

        res.render('carrinho', { cartItems });
    } catch (error) {
        console.error(error);
        res.render('carrinho', { mensagem: 'Erro ao carregar o carrinho.', cartItems: [] });
    }
};

// Adicionar item ao carrinho
const addToCart = async (req, res) => {
    const productId = req.params.id;
    const quantity = req.query.quantity || 1;
    const userId = req.session.userId;

    if (!userId) {
        return res.redirect('/login');
    }

    if (quantity <= 0) {
        return res.redirect('/carrinho'); // Não permitir adicionar quantidade inválida
    }

    try {
        // Verificar se o produto existe
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.redirect('/carrinho'); // Produto não encontrado
        }

        // Verificar se há estoque suficiente
        if (product.stock < quantity) {
            return res.redirect('/carrinho'); // Não há estoque suficiente
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

        // Recarregar os itens do carrinho após adicionar
        const cartItems = await CartItem.findAll({
            where: { userId },
            include: [Product]
        });

        const total = cartItems.reduce((acc, item) => acc + (item.quantity * item.price), 0);

        // Always pass cartItems and total
        res.render('carrinho', { cartItems: cartItems || [], total: total.toFixed(2) });

    } catch (error) {
        console.error(error);
        res.render('carrinho', { mensagem: 'Erro ao adicionar item ao carrinho.', cartItems: [] });
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
        res.render('carrinho', { mensagem: 'Erro ao remover item do carrinho.' });
    }
};

module.exports = {
    getCart,
    addToCart,
    removeFromCart
};
