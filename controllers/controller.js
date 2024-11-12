const User = require('../models/user');
const CartItem = require('../models/item-carrinho');
const Product = require('../models/produto');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

// Render the login page
const getLoginPage = (req, res) => {
    res.render('login', { mensagem: '' });
};

// Handle user login
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Busca o usuário no banco de dados
        const user = await User.findOne({ where: { email } });
        
        // Verifica se o usuário existe
        if (!user) {
            return res.render('login', { mensagem: 'Usuário não encontrado' });
        }

        // Verifica se a senha fornecida corresponde ao hash armazenado
        const isMatch = await bcrypt.compare(password, user.password); // Compara com o hash armazenado
        if (!isMatch) {
            return res.render('login', { mensagem: 'Senha incorreta' });
        }

        // Lógica de autenticação, como criar uma sessão
        req.session.userId = user.id;  // Armazenar o ID do usuário na sessão
        req.session.role = user.role;  // Armazenar o cargo (role) do usuário na sessão

        res.redirect('/conta'); // Redireciona para a página de conta ou qualquer página pós-login
    } catch (error) {
        console.error('Erro no login:', error);
        res.render('login', { mensagem: 'Erro ao fazer login.' });
    }
};

// Handle user registration
const createUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    // Validação dos dados de entrada (se necessário)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('cadastro', { mensagem: errors.array()[0].msg });
    }

    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.render('cadastro', { mensagem: 'Usuário já existe com esse email.' });
        }

        // Aguarda a hash da senha antes de armazená-la
        const hashedPassword = await bcrypt.hash(password, 10);

        // Criação do novo usuário
        await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'user', // Define 'user' como valor padrão para o cargo
        });

        res.redirect('/');  // Redireciona para a página de login
    } catch (error) {
        console.error('Erro ao inserir usuário:', error);
        res.render('cadastro', { mensagem: 'Erro ao cadastrar usuário.' });
    }
};

// Handle user logout
const logoutUser = async (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Erro ao deslogar:', err);
            return res.redirect('/');
        }
        res.render('login', { mensagem: 'Usuário deslogado com sucesso!' });
    });
};

// Middleware para verificar se o usuário é administrador
const isAdmin = (req, res, next) => {
    if (req.session.role === 'admin') {
        return next(); // Usuário é admin, pode acessar a rota
    }
    res.redirect('/'); // Redireciona para a página inicial se não for admin
};

// Funções do carrinho
// Exibir o carrinho de compras
const getCart = async (req, res) => {
    try {
        const userId = req.session.userId;

        if (!userId) {
            return res.redirect('/login'); // Caso o usuário não esteja logado
        }

        // Buscar os itens do carrinho do usuário
        const cartItems = await CartItem.findAll({
            where: { userId },
            include: [Product] // Inclui os detalhes do produto
        });

        // Calcular o total
        const total = cartItems.reduce((acc, item) => acc + (item.quantity * item.price), 0);

        res.render('carrinho', {
            cartItems,
            total: total.toFixed(2) // Total formatado
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
        return res.redirect('/login'); // Verifica se o usuário está logado
    }

    try {
        // Verificar se o produto já está no carrinho
        const existingItem = await CartItem.findOne({ where: { userId, productId } });

        if (existingItem) {
            // Atualiza a quantidade
            existingItem.quantity += quantity;
            await existingItem.save();
        } else {
            // Adiciona um novo item no carrinho
            const product = await Product.findByPk(productId);
            await CartItem.create({
                userId,
                productId,
                quantity,
                price: product.price
            });
        }

        res.redirect('/carrinho'); // Redireciona para a página do carrinho
    } catch (error) {
        console.error(error);
        res.redirect('/carrinho');
    }
};

// Remover item do carrinho
const removeFromCart = async (req, res) => {
    const { cartItemId } = req.params;

    try {
        // Remove o item do carrinho
        await CartItem.destroy({ where: { id: cartItemId } });
        res.redirect('/carrinho');
    } catch (error) {
        console.error(error);
        res.redirect('/carrinho');
    }
};

module.exports = {
    getLoginPage,
    loginUser,
    logoutUser,
    createUser,
    isAdmin, // Exporta o middleware isAdmin
    getCart,
    addToCart,
    removeFromCart
};