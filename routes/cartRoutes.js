const express = require('express');
const { getCart, addToCart, removeFromCart } = require('../controllers/cartController');
const router = express.Router();

/**
 * @swagger
 * /carrinho:
 *   get:
 *     summary: Retorna os itens do carrinho de compras
 *     description: Retorna a lista de produtos no carrinho de compras do usuário.
 *     responses:
 *       200:
 *         description: Lista de itens do carrinho
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
 *                   quantity:
 *                     type: integer
 *                   total:
 *                     type: number
 *                     format: float
 */
router.get('/carrinho', getCart);

/**
 * @swagger
 * /carrinho/adicionar/{id}:
 *   get:
 *     summary: Adiciona um produto ao carrinho
 *     description: Adiciona um produto específico ao carrinho de compras do usuário.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do produto a ser adicionado ao carrinho
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Produto adicionado ao carrinho com sucesso
 *       404:
 *         description: Produto não encontrado
 */
router.get('/carrinho/adicionar/:id', addToCart);

/**
 * @swagger
 * /carrinho/remover/{id}:
 *   get:
 *     summary: Remove um produto do carrinho
 *     description: Remove um produto específico do carrinho de compras do usuário.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do produto a ser removido do carrinho
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Produto removido do carrinho com sucesso
 *       404:
 *         description: Produto não encontrado no carrinho
 */
router.get('/carrinho/remover/:id', removeFromCart);

module.exports = router;
