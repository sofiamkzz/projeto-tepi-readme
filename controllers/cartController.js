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
    const productId = req.params.id;  // ID do produto vindo da URL
    const quantity = 1;  // Definindo a quantidade padrão como 1
    const userId = req.session.userId;

    if (!userId) {
        return res.redirect('/login');  // Caso o usuário não esteja logado
    }

    try {
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.redirect('/carrinho');  // Produto não encontrado
        }

        if (product.stock < quantity) {
            return res.redirect('/carrinho?mensagem=Estoque insuficiente');  // Não há estoque suficiente
        }

        // Verificar se o produto já está no carrinho
        const existingItem = await CartItem.findOne({ where: { userId, productId } });

        if (existingItem) {
            // Se o item já está no carrinho, atualizamos a quantidade
            existingItem.quantity += quantity;
            await existingItem.save();
        } else {
            // Caso contrário, criamos um novo item no carrinho
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

        // Renderizar novamente o carrinho
        res.render('carrinho', { cartItems, total: total.toFixed(2) });
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
