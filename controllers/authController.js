const bcrypt = require('bcrypt');
const User = require('../models/user');

// Render the login page
const getLoginPage = (req, res) => {
    res.render('login', { mensagem: '' });
};

// Handle user login
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.render('login', { mensagem: 'Usuário não encontrado.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render('login', { mensagem: 'Senha incorreta.' });
        }

        req.session.userId = user.id;
        res.render('conta', { user });
    } catch (error) {
        console.error('Erro no login:', error);
        res.render('login', { mensagem: 'Erro ao fazer login.' });
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

module.exports = {
    getLoginPage,
    loginUser,
    logoutUser
};