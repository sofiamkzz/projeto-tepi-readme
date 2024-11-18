const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Renderiza a página de login
const getLoginPage = (req, res) => {
    res.render('login', { mensagem: '' });
};

// Função de login
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({where: {email: email}});

        if (user) {
            if (await bcrypt.compare(password, user.password)) {
                const token = jwt.sign({ id: user.id, email: user.email }, process.env.SECRET, { expiresIn: '1h' });
                req.session.userId = user.id;
                res.render('conta', { user: user, token: token });
            }
        }
        else {
            return res.render('login', { mensagem: 'Usuário não encontrado.' });
        }

    } catch (error) {
        console.error('Erro no login:', error);
        res.render('login', { mensagem: 'Erro ao fazer login.' });
    }
};

// Função para deslogar usuário
const logoutUser = async (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Erro ao deslogar:', err);
            return res.redirect('/');
        }

        res.clearCookie('connect.sid');
        res.render('login', { mensagem: 'Usuário deslogado com sucesso!' });
    });
};

module.exports = {
    getLoginPage,
    loginUser,
    logoutUser
};
