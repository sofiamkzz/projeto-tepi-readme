// Carrega variáveis de ambiente do .env
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const { getLoginPage, createUser, loginUser, logoutUser } = require('./controllers/controller');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

// Middlewares para parsear dados do corpo das requisições
app.use(express.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET || 'your_default_secret_key', // Use an environment variable
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Rota principal (GET)
app.get('/', getLoginPage);

// Rota de Login
app.post('/login', loginUser);

// Rota de cadastro (GET)
app.get('/cadastro', (req, res) => {
    res.render('cadastro', { mensagem: '' }); 
});

// Rota de cadastro (POST)
app.post('/cadastro', createUser); 

// Rota de Logout
app.get('/logout', logoutUser);

// Middleware de erro
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo deu errado!');
});

// Servidor ouvindo na porta 3000
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
