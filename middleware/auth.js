require('dotenv').config();
const jwt = require('jsonwebtoken');
const secret = process.env.SECRET;

// Middleware de autenticação
const authenticateToken = (req, res, next) => {
    // Verificar se o token está no cabeçalho de autorização
    const authHeader = req.headers['authorization'];
    console.log('Authorization Header:', authHeader);  // Log do cabeçalho Authorization

    if (!authHeader) {
        return res.status(401).json({ error: 'Token não fornecido. Autorização necessária.' });
    }

    // O token é esperado no formato "Bearer <token>"
    const token = authHeader.split(' ')[1]; // Pega a parte após o "Bearer"
    console.log('Token extraído:', token);  // Log do token extraído

    if (!token) {
        return res.status(401).json({ error: 'Token mal formatado. Por favor, use o formato "Bearer <token>".' });
    }

    // Verificação do token
    jwt.verify(token, secret, (err, user) => {
        if (err) {
            console.log('Erro na verificação do token:', err);  // Log do erro de verificação
            return res.status(403).json({ error: 'Token inválido. Acesso proibido.' });
        }

        console.log('Usuário autenticado:', user);  // Log do usuário autenticado
        req.user = user; // O usuário é atribuído à requisição para ser usado nas rotas
        next(); // Chama o próximo middleware ou rota
    });
};

module.exports = authenticateToken;
