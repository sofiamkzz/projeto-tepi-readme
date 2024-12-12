const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const getLoginPage = (req, res) => {
    res.render('login', { mensagem: '' });
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.render('login', { mensagem: 'Por favor, preencha todos os campos.' });
    }

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).render('login', { mensagem: 'Usuário ou senha incorretos.' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).render('login', { mensagem: 'Usuário ou senha incorretos.' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.SECRET, { expiresIn: '1h' });

        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 3600000,  // 1 hora
        });

        req.user = user;
        req.session.userId = user.id;
        req.session.userRole = user.role;  

        if (user.role === 'admin') {
            try {
                const users = await User.findAll();  
                return res.render('admin', { usuarios: users || [] });
            } catch (error) {
                console.error('Erro ao buscar usuários:', error);
                return res.status(500).send('Erro ao carregar a lista de usuários');
            }
        }

        return res.render('conta', { user: user, token: token, mensagem: req.query.mensagem || null });

    } catch (error) {
        console.error('Erro ao realizar login:', error);
        return res.status(500).render('login', { mensagem: 'Erro interno no servidor.' });
    }
};

const logoutUser = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Erro ao deslogar:', err);
            return res.redirect('/');
        }

        res.clearCookie('token');  
        res.clearCookie('connect.sid');

        res.render('login', { mensagem: 'Usuário deslogado com sucesso!' });
    });
};

module.exports = {
    getLoginPage,
    loginUser,
    logoutUser
};
