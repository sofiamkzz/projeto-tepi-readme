const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const app = express();

// Configurando EJS como view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Middleware para processar dados do formulário
app.use(express.urlencoded({ extended: true }));

// Middleware para servir arquivos estáticos
app.use(express.static('public'));

// Middleware para parsing de cookies
app.use(cookieParser());

// Configuração de sessões
app.use(session({
    secret: 'seuSegredoMuitoSecreto',  // Troque isso por uma chave secreta mais segura
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }  // Defina como true se estiver usando HTTPS
}));

// Rota padrão para renderizar a página index.ejs
app.get('/', (req, res) => {
    // Definindo um cookie
    res.cookie('cookieName', 'cookieValue', { maxAge: 900000, httpOnly: true });

    // Usando a sessão
    if (req.session.visits) {
        req.session.visits += 1;
    } else {
        req.session.visits = 1;
    }

    res.render('index', { visits: req.session.visits });
});

// Middleware para tratamento de erros 404
app.use((req, res, next) => {
    res.status(404).send('Página não encontrada');
});

// Middleware para tratamento de erros genéricos
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo deu errado!');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`O servidor está rodando na porta ${PORT}`);
});
