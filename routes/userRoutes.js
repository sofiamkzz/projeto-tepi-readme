const express = require('express');
const { createUser, updateUser, deleteUserById } = require('../controllers/userController');
const router = express.Router();

router.post('/cadastro', createUser);
router.put('/atualizar/:id', updateUser);
router.delete('/delete/:userId', deleteUserById);

module.exports = router;
