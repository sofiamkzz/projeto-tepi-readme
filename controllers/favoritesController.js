const Favorite = require('../models/favorites');
const User = require('../models/user');
const Product = require('../models/produto');

const addFavorite = async (req, res) => {
    const { productId } = req.body;  
    const userId = req.session.userId; 

    if (!userId) {
        return res.redirect('/login');
    }

    try {
        const user = await User.findByPk(userId);
        const product = await Product.findByPk(productId);

        if (!user || !product) {
            return res.status(404).send('Usuário ou produto não encontrado');
        }

        await user.addProduct(product);

        res.redirect('/favoritos');
    } catch (error) {
        console.error('Erro ao adicionar favorito:', error);
        res.status(500).send('Erro ao adicionar produto aos favoritos');
    }
};

const removeFavorite = async (req, res) => {
    const { productId } = req.params;
    const userId = req.session.userId;

    if (!userId) {
        return res.redirect('/login');
    }

    try {
        const user = await User.findByPk(userId);
        const product = await Product.findByPk(productId);

        if (!user || !product) {
            return res.status(404).send('Usuário ou produto não encontrado');
        }

        await user.removeProduct(product);

        res.status(200).json({ message: 'Produto removido dos favoritos!' });
    } catch (error) {
        console.error('Erro ao remover favorito:', error);
        res.status(500).send('Erro ao remover produto dos favoritos');
    }
};

const getFavorites = async (req, res, token) => {
    const userId = req.session.userId;

    if (!userId) {
        return res.redirect('/login');
    }

    try {
        const user = await User.findByPk(userId, {
            include: Product,
        });

        if (!user) {
            return res.status(404).send('Usuário não encontrado');
        }

        res.render('favoritos', { user, favoritos: user.Products, token });
    } catch (error) {
        console.error('Erro ao buscar favoritos:', error);
        res.status(500).send('Erro ao carregar produtos favoritos');
    }
};

module.exports = {
    addFavorite,
    removeFavorite,
    getFavorites
};