const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const secret = process.env.SECRET;

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
        // Verifica se o usuário existe
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).render('login', { mensagem: 'Usuário ou senha incorretos.' });
        }

        // Verifica a senha
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).render('login', { mensagem: 'Usuário ou senha incorretos.' });
        }

        const token = jwt.sign(user.id, secret);
        console.log(token);

        // Define o cookie com o token (não envia resposta ainda)
        res.cookie('token', token, {
            httpOnly: true, // Protege contra ataques de XSS
            maxAge: 3600000 // Expira em 1 hora
        });

        // Armazenar o ID do usuário na sessão
        req.session.userId = user.id;

        // Redirecionar para a página da conta ou uma página de sucesso
        res.render('conta', { user: user, token: token, mensagem: req.query.mensagem || null });
    } catch (error) {
        console.error('Erro ao realizar login:', error);
        // Certifique-se de não enviar outra resposta aqui
        return res.status(500).render('login', { mensagem: 'Erro interno no servidor.' });
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
        res.clearCookie('connect.sid'); // Express-session

        // Redireciona para a página de login
        res.render('login', { mensagem: 'Usuário deslogado com sucesso!' });
    });
};

module.exports = {
    getLoginPage,
    loginUser,
    logoutUser
};
