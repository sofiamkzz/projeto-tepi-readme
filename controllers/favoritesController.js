const Favorite = require('../models/favorite');
const User = require('../models/user');
const Product = require('../models/product');

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

        const isFavorite = await user.hasProduct(product);
        if (isFavorite) {
            return res.status(400).send('Produto já está nos seus favoritos');
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

        const isFavorite = await user.hasProduct(product); // Verificar se está favoritado
        if (!isFavorite) {
            return res.status(400).send('Produto não está nos seus favoritos');
        }

        await user.removeProduct(product); // Removendo o produto dos favoritos
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
            include: {
                model: Product,
                attributes: ['id', 'name', 'price', 'imageUrl'], // Exemplo de carregar apenas os dados necessários
                through: { attributes: [] } // Não carregar dados da tabela intermediária
            },
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
