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

    if (!email || !password) {
        return res.render('login', { mensagem: 'Por favor, preencha todos os campos.' });
    }

    try {
        const user = await User.findOne({ where: { email: email } });

        if (user) {
            // Verifique o valor do hash armazenado no banco de dados
            console.log(user);

            // Verifique se a comparação está retornando o valor esperado
            const isPasswordValid = await bcrypt.compare(password.trim(), user.password);

            if (isPasswordValid) {
                const token = jwt.sign({ userId: user.id, email: user.email }, process.env.SECRET, { expiresIn: '1h' });
                res.cookie('auth_token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 3600000 });
                req.session.userId = user.id;
                res.render('conta', { user: user, token: token});
            } else {
                return res.render('login', { mensagem: 'Senha incorreta.' });
            }
        } else {
            return res.render('login', { mensagem: 'Email ou senha incorretos.' });
        }
    } catch (error) {
        console.error('Erro no login:', error);
        return res.render('login', { mensagem: 'Erro ao fazer login. Tente novamente mais tarde.' });
    }
};

// Função para deslogar usuário
const logoutUser = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Erro ao deslogar:', err);
            return res.redirect('/');
        }

        // Limpa o cookie HTTP-only
        res.clearCookie('auth_token');  // Cookie de autenticação
        res.clearCookie('connect.sid'); // Caso você esteja usando o Express-session

        // Redireciona para a página de login
        res.render('login', { mensagem: 'Usuário deslogado com sucesso!' });
    });
};

module.exports = {
    getLoginPage,
    loginUser,
    logoutUser
};
