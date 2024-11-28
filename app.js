require('dotenv').config();

const express = require('express');
const session = require('express-session');
const path = require('path');
const jwt = require('jsonwebtoken');

const sequelize = require('./config/database');

const userRoutes = require('./routes/userRoutes'); 
const authRoutes = require('./routes/authRoutes'); 
const cartRoutes = require('./routes/cartRoutes'); 
const favoritesRoutes = require('./routes/favoritesRoutes');
const User = require('./models/user');
const Product = require('./models/produto');

const { getLoginPage, loginUser, logoutUser } = require('./controllers/authController');
const { getCart, addToCart, removeFromCart } = require('./controllers/cartController');
const { addFavorite, removeFavorite, getFavorites } = require('./controllers/favoritesController');
const { createUser, updateUser, deleteUserById } = require('./controllers/userController');

const authenticateToken = require('./middleware/auth');
const isAdmin = require('./middleware/isAdmin'); 

const app = express();
const port = 3000;

const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

// Middleware para sessões
app.use(session({
    secret:'secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Apenas em produção
        httpOnly: true, // Protege contra XSS
        maxAge: 3600000 // 1 hora de expiração
    }
}));

// Sincronizando o banco de dados (sem force: true para evitar apagar dados)
/*sequelize.sync({ alter: false }).then(() => {
    console.log('Banco de dados sincronizado..');
});*/

sequelize.sync({ force: true });

// ROTAS TEMPORÁRIAS
app.get('/login', getLoginPage);

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

app.post('/login', loginUser);
app.post('/atualizar/:id', updateUser);
app.get('/delete/:id', deleteUserById);

app.get('/cadastro', (req, res) => {
    res.render('cadastro', { mensagem: '' }); 
});
app.post('/cadastro', createUser); 

app.get('/carrinho', getCart);
app.get('/carrinho/adicionar/:id', getCart, addToCart);

app.get('/favoritos', getFavorites); 

app.get('/historico', (req, res) => {
    res.render('historico');
});

// Rota de Logout
app.get('/logout', logoutUser);

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

// Servidor ouvindo na porta 3000
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
