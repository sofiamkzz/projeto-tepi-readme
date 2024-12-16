const express = require('express');
const { createUser, updateUser, deleteUserById } = require('../controllers/userController');
const router = express.Router();

/**
 * @swagger
 * /cadastro:
 *   get:
 *     summary: Exibe o formulário de cadastro
 *     description: Retorna a página com o formulário para criar um novo usuário.
 *     responses:
 *       200:
 *         description: Página de cadastro carregada
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 */
router.get('/cadastro', (req, res) => {
    res.render('cadastro', { mensagem: '' });
});

/**
 * @swagger
 * /cadastro:
 *   post:
 *     summary: Cria um novo usuário
 *     description: Recebe os dados do usuário e cria um novo no banco de dados.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Dados inválidos ou incompletos
 */
router.post('/cadastro', createUser);

/**
 * @swagger
 * /atualizar/{id}:
 *   post:
 *     summary: Atualiza os dados de um usuário
 *     description: Atualiza as informações de um usuário específico baseado no ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do usuário a ser atualizado
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *       400:
 *         description: Dados inválidos ou ID não encontrado
 */
router.post('/atualizar/:id', updateUser);

/**
 * @swagger
 * /deletar/{id}:
 *   get:
 *     summary: Deleta um usuário pelo ID
 *     description: Deleta um usuário específico com base no ID fornecido.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do usuário a ser deletado
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuário deletado com sucesso
 *       404:
 *         description: Usuário não encontrado
 */
router.get('/deletar/:id', deleteUserById);

module.exports = router;
