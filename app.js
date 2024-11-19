require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

const sequelize = require('./config/database');

const userRoutes = require('./routes/userRoutes'); 
const authRoutes = require('./routes/authRoutes'); 
const cartRoutes = require('./routes/cartRoutes'); 
const favoritesRoutes = require('./routes/favoritesRoutes');
const User = require('./models/user');

const { getLoginPage, loginUser, logoutUser } = require('./controllers/authController');
const { createUser, updateUser, deleteUserById } = require('./controllers/userController');

const authenticateToken = require('./middleware/auth');
const isAdmin = require('./middleware/isAdmin'); 

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

// Middleware para sessões
app.use(session({
    secret: process.env.SESSION_SECRET || 'your_default_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Apenas em produção
        httpOnly: true, // Protege contra XSS
        maxAge: 3600000 // 1 hora de expiração
    }
}));

// Sincronizando o banco de dados (sem force: true para evitar apagar dados)
sequelize.sync({ alter: false }).then(() => {
    console.log('Banco de dados sincronizado..');
});

app.get('/', getLoginPage);
app.post('/login', loginUser);

// Use userRoutes for all user-related paths, including /cadastro
app.get('/cadastro', (req, res) => {
    res.render('cadastro', { mensagem: '' }); 
});

// Rota de cadastro (POST)
app.post('/cadastro', createUser); 

// Rotas de Carrinho (Autenticadas)
app.get('/carrinho', authenticateToken, cartRoutes);

app.post('/atualizar/:user.id', updateUser);
app.get('/delete/:id', deleteUserById);

// Rota de Admin (Protegida por Middleware de Admin)
app.get('/admin', async (req, res) => {
    try {
        const users = await User.findAll();
        res.render('admin', { usuarios: users || [] });
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        res.status(500).send('Erro ao carregar a lista de usuários');
    }
});

// Rota de favoritos
app.get('/favoritos', authenticateToken, favoritesRoutes); 

app.get('/historico', (req, res) => {
    res.render('historico');
});

// Rota de Logout
app.get('/logout', logoutUser);

// Servidor ouvindo na porta 3000
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
