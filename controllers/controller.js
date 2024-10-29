// controller.js

const User = require('../models/user');
const bcrypt = require('bcrypt');

// Render the login page
const getLoginPage = (req, res) => {
    res.render('index', { mensagem: '' });
};

// Handle user login
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Espera a busca do usuário no banco de dados
        const user = await User.findOne({ where: { email } });
        
        // Verifica se o usuário existe
        if (!user) {
            return res.render('index', { mensagem: 'Usuário não encontrado' });
        }

        // Verifica se a senha fornecida corresponde ao hash armazenado
        const hashedPassword = await bcrypt.hash(password, 10);
        const isMatch = await bcrypt.compare(password, hashedPassword);
        if (!isMatch) {
            return res.render('index', { mensagem: 'Senha incorreta' });
        }

        // Lógica de autenticação, como criar uma sessão
        req.session.userId = user.id; // Armazenar o ID do usuário na sessão

        res.render('home', { email }); // Redireciona para uma página após o login bem-sucedido
    } catch (error) {
        console.error('Erro no login:', error);
        res.render('index', { mensagem: 'Erro ao fazer login.' });
    }
};

// Handle user registration
const createUser = async (req, res) => {
    const { name, email, password } = req.body;

    // Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('cadastro', { mensagem: errors.array()[0].msg });
    }

    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.render('cadastro', { mensagem: 'Usuário já existe com esse email.' });
        }

        // Aguarde a hash da senha antes de armazená-la
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ name, email, password: hashedPassword });
        res.redirect('/');
    } catch (error) {
        console.error('Erro ao inserir usuário:', error);
        res.render('cadastro', { mensagem: 'Erro ao cadastrar usuário.' });
    }
}

// Handle user logout
const logoutUser = async (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Erro ao deslogar:', err);
            return res.redirect('/');
        }
        res.render('index', { mensagem: 'Usuário deslogado com sucesso!' });
    });
};

module.exports = {
    getLoginPage,
    loginUser,
    logoutUser,
    createUser
};
