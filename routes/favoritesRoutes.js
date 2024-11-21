const express = require('express');
const authenticateToken = require('../middleware/auth');
const { addFavorite, removeFavorite, getFavorites } = require('../controllers/favoritesController');
const router = express.Router();

router.get('/favoritos', authenticateToken, getFavorites, (req, res) => {
    res.render('favoritos');
});
router.post('/adicionar', addFavorite);
router.delete('/remover/:productId', removeFavorite);

module.exports = router;
