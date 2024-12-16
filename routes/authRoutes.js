const express = require('express');
const { getLoginPage, loginUser, logoutUser } = require('../controllers/authController');
const router = express.Router();

/**
 * @swagger
 * /login:
 *   get:
 *     summary: Retorna a página de login
 *     description: Exibe a página de login onde o usuário pode inserir suas credenciais para acessar o sistema.
 *     responses:
 *       200:
 *         description: Página de login carregada com sucesso
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 */
router.get('/login', getLoginPage);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Realiza o login do usuário
 *     description: Autentica o usuário com suas credenciais (usuário e senha). Se bem-sucedido, retorna um token ou sessão de login.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login bem-sucedido. Retorna informações do usuário e/ou token de autenticação.
 *       401:
 *         description: Credenciais inválidas.
 */
router.post('/login', loginUser);

/**
 * @swagger
 * /logout:
 *   get:
 *     summary: Realiza o logout do usuário
 *     description: Finaliza a sessão ou invalida o token do usuário, desconectando-o do sistema.
 *     responses:
 *       200:
 *         description: Logout realizado com sucesso.
 *       401:
 *         description: Usuário não está autenticado.
 */
router.get('/logout', logoutUser);

module.exports = router;
