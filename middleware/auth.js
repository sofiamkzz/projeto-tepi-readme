require('dotenv').config();

const jwt = require('jsonwebtoken');
const secret = process.env.SECRET;

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido.' });
    }

    jwt.verify(token, secret, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token inválido.' });
        }

        req.user = user;
        next();
    });
};

module.exports = authenticateToken;