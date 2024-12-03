const express = require('express');
const { getCart, addToCart, removeFromCart } = require('../controllers/cartController');
const router = express.Router();

// Rota para exibir o carrinho
router.get('/carrinho', getCart);

// Rota para adicionar um produto ao carrinho
router.get('/carrinho/adicionar/:id', addToCart);

// Rota para remover um produto do carrinho
router.get('/carrinho/remover/:id', removeFromCart);

module.exports = router;
