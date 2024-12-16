const express = require('express');
const { addFavorite, removeFavorite, getFavorites } = require('../controllers/favoritesController');
const router = express.Router();

/**
 * @swagger
 * /favoritos:
 *   get:
 *     summary: Retorna os favoritos do usuário
 *     description: Retorna uma lista de produtos que o usuário marcou como favoritos.
 *     responses:
 *       200:
 *         description: Lista de favoritos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   price:
 *                     type: number
 *                     format: float
 *                   description:
 *                     type: string
 */
router.get('/favoritos', getFavorites);

/**
 * @swagger
 * /favoritos/adicionar/{id}:
 *   get:
 *     summary: Adiciona um produto aos favoritos
 *     description: Adiciona um produto específico aos favoritos do usuário.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do produto a ser adicionado aos favoritos
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Produto adicionado aos favoritos com sucesso
 *       404:
 *         description: Produto não encontrado
 */
router.get('/favoritos/adicionar/:id', addFavorite);

/**
 * @swagger
 * /favoritos/remover/{id}:
 *   get:
 *     summary: Remove um produto dos favoritos
 *     description: Remove um produto específico dos favoritos do usuário.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do produto a ser removido dos favoritos
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Produto removido dos favoritos com sucesso
 *       404:
 *         description: Produto não encontrado nos favoritos
 */
router.get('/favoritos/remover/:id', removeFavorite);

module.exports = router;
