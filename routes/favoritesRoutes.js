const express = require('express');
const { addFavorite, removeFavorite, getFavorites } = require('../controllers/favoritesController');
const router = express.Router();

// Rota para exibir os favoritos do usuário
router.get('/favoritos', getFavorites);

// Rota para adicionar um produto aos favoritos
router.post('/favoritos/adicionar/:id', addFavorite);

// Rota para remover um produto dos favoritos
router.post('/favoritos/remover/:id', removeFavorite);

module.exports = router;
