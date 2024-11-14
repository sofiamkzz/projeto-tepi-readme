const express = require('express');
const { getCart, addToCart, removeFromCart } = require('../controllers/cartController');
const router = express.Router();

router.get('/carrinho', getCart);
router.post('/carrinho/add', addToCart);
router.delete('/carrinho/remove/:cartItemId', removeFromCart);

module.exports = router;