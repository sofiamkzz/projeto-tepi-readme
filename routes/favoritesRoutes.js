const express = require('express');
const { addFavorite, removeFavorite, getFavorites } = require('../controllers/favoritesController');
const router = express.Router();

router.get('/favoritos', getFavorites);

router.post('/favoritos/adicionar/:id', addFavorite);

router.post('/favoritos/remover/:id', removeFavorite);

module.exports = router;