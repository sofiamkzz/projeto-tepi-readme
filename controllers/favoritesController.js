const Favorite = require('../models/favorites');
const User = require('../models/user');
const Product = require('../models/produto');

// Adicionar produto aos favoritos
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

        // Adiciona o produto aos favoritos do usuário
        await user.addProduct(product); // Usando o método addProduct gerado pelo Sequelize

        res.redirect('/favoritos');
    } catch (error) {
        console.error('Erro ao adicionar favorito:', error);
        res.status(500).send('Erro ao adicionar produto aos favoritos');
    }
};

// Remover produto dos favoritos
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

        // Remove o produto dos favoritos do usuário
        await user.removeProduct(product); // Usando o método removeProduct gerado pelo Sequelize

        res.redirect('/favoritos');
    } catch (error) {
        console.error('Erro ao remover favorito:', error);
        res.status(500).send('Erro ao remover produto dos favoritos');
    }
};

// Listar todos os produtos favoritos do usuário
const getFavorites = async (req, res) => {
    const userId = req.session.userId;

    if (!userId) {
        return res.redirect('/login');
    }

    try {
        const user = await User.findByPk(userId, {
            include: Product // Inclui os produtos favoritos
        });

        if (!user) {
            return res.status(404).send('Usuário não encontrado');
        }

        res.render('favoritos', { user, favorites: user.Products });
    } catch (error) {
        console.error('Erro ao buscar favoritos:', error);
        res.status(500).send('Erro ao carregar produtos favoritos');
    }
};
