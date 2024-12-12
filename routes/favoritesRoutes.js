const express = require('express');
const { addFavorite, removeFavorite, getFavorites } = require('../controllers/favoritesController');
const router = express.Router();

router.get('/favoritos', getFavorites);

router.get('/favoritos/adicionar/:id', addFavorite);

router.get('/favoritos/remover/:id', removeFavorite);

module.exports = router;
