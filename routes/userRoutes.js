const express = require('express');
const { createUser, updateUser, deleteUserById } = require('../controllers/userController');
const router = express.Router();

router.get('/cadastro', (req, res) => {
    res.render('cadastro', { mensagem: '' });
});

router.post('/cadastro', createUser);

router.post('/atualizar/:id', updateUser);

router.get('/deletar/:id', deleteUserById);

module.exports = router;
