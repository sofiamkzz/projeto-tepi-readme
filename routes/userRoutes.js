const express = require('express');
const { createUser, updateUser, deleteUserById } = require('../controllers/userController');
const router = express.Router();

// Registration page (GET)
router.get('/cadastro', (req, res) => {
    res.render('cadastro', { mensagem: '' });
});

// Create user (POST)
router.post('/cadastro', createUser);

// Update user by ID (PUT)
router.post('/atualizar/:id', updateUser);

// Delete user by ID (DELETE)
router.get('/deletar/:userId', deleteUserById);

module.exports = router;
