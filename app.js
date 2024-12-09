require('dotenv').config();

const express = require('express');
const session = require('express-session');
const path = require('path');

const sequelize = require('./config/database');

const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes');
const favoritesRoutes = require('./routes/favoritesRoutes');

const Product = require('./models/produto');

const authenticateToken = require('./middleware/auth');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.use(session({
    secret: 'secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true, 
        maxAge: 3600000 
    }
}));

sequelize.sync({ alter: true })
    .then(() => {
        console.log("Banco de dados sincronizado!");
    })
    .catch((error) => {
        console.error("Erro ao sincronizar o banco de dados: ", error);
    });

app.get('/', async (req, res) => {
    try {
        const products = await Product.findAll({});

        const user = req.user || "";

        res.render('index', { user, products: products || [] });
    } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        res.status(500).send("Erro ao carregar produtos");
    }
});

app.use(userRoutes);
app.use(authRoutes);
app.use(cartRoutes);
app.use(favoritesRoutes);

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
