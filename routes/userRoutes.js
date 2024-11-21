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
router.put('/atualizar/:id', updateUser);

// Delete user by ID (DELETE)
router.delete('/delete/:userId', deleteUserById);

module.exports = router;
