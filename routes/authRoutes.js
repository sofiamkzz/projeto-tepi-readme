const express = require('express');
const { getLoginPage, loginUser, logoutUser } = require('../controllers/authController');
const router = express.Router();

// Rota para exibir a página de login
router.get('/login', getLoginPage);

// Rota para realizar login
router.post('/login', loginUser);

// Rota para realizar logout
router.get('/logout', logoutUser);

module.exports = router;
