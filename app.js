const express = require('express');
const app = express();

// Configurando EJS como view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Middleware para processar dados do formulário
app.use(express.urlencoded({ extended: true }));

// Middleware para servir arquivos estáticos
app.use(express.static('public'));

// Rota padrão para renderizar a página index.ejs
app.get('/', (req, res) => {
    res.render('index');
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
