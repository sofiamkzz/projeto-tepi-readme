require('dotenv').config();

const express = require('express');
const session = require('express-session');
const path = require('path');
const jwt = require('jsonwebtoken');

const sequelize = require('./config/database');

const userRoutes = require('./routes/userRoutes');  // Importa as rotas de usuário
const authRoutes = require('./routes/authRoutes');  // Importa as rotas de autenticação
const cartRoutes = require('./routes/cartRoutes');  // Importa as rotas de carrinho
const favoritesRoutes = require('./routes/favoritesRoutes');  // Importa as rotas de favoritos

const User = require('./models/user');
const Product = require('./models/produto');

const authenticateToken = require('./middleware/auth');
const isAdmin = require('./middleware/isAdmin');

const models = require('./models/relacoes');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

// Middleware para sessões
app.use(session({
    secret: 'secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Apenas em produção
        httpOnly: true, // Protege contra XSS
        maxAge: 3600000 // 1 hora de expiração
    }
}));

sequelize.sync({ alter: true }) //force
    .then(() => {
        console.log("Banco de dados sincronizado!");
    })
    .catch((error) => {
        console.error("Erro ao sincronizar o banco de dados: ", error);
    });

app.get('/', async (req, res) => {
    try {
        // Buscando os produtos do banco de dados
        const products = await Product.findAll({});

        const user = req.user || "";

        // Renderizando a página principal e passando os produtos como variável
        res.render('index', { user, products: products || [] });
    } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        res.status(500).send("Erro ao carregar produtos");
    }
});

// Definindo rotas específicas para as funcionalidades
app.use(userRoutes);
app.use(authRoutes);
app.use(cartRoutes);
app.use(favoritesRoutes);

// Rota de Admin (Protegida por Middleware de Admin)
app.get('/admin', isAdmin, async (req, res) => {
    try {
        const users = await User.findAll();
        res.render('admin', { usuarios: users || [] });
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        res.status(500).send('Erro ao carregar a lista de usuários');
    }
});

// Servidor ouvindo na porta 3000
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
