const express = require('express');
const { getCart, addToCart, removeFromCart } = require('../controllers/cartController');
const router = express.Router();

router.get('/carrinho', getCart);

router.get('/carrinho/adicionar/:id', addToCart);

router.get('/carrinho/remover/:id', removeFromCart);

module.exports = router;