const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const User = require('../models/user');

// Criar usuário
const createUser = async (req, res) => {
    const { name, email, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('cadastro', { mensagem: errors.array()[0].msg });
    }

    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.render('cadastro', { mensagem: 'Usuário já existe com esse email.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({ name, email, password: hashedPassword });

        res.redirect('/');
    } catch (error) {
        console.error('Erro ao inserir usuário:', error);
        res.render('cadastro', { mensagem: 'Erro ao cadastrar usuário.' });
    }
};

// Atualizar dados do usuário
const updateUser = async (req, res) => {
    const { newName, newEmail, newPassword } = req.body;

    try {
        const user = await User.findByPk(req.session.userId);
    
        user.name = newName;
        user.email = newEmail;
        
        if (newPassword) {
            const hashedPassword = await bcrypt.hash(newPassword, 10); 
            user.password = hashedPassword;
        }
    
        await user.save();

        res.render('conta', { user });
    
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao atualizar os dados.' });
    }
};

// Função para deletar um usuário pelo ID
const deleteUserById = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).send('Usuário não encontrado.');
        }

        await user.destroy();
        console.log(`Usuário com ID ${userId} deletado com sucesso.`);
        res.redirect('/admin');
    } catch (error) {
        console.error('Erro ao deletar usuário:', error);
        res.status(500).send('Erro ao tentar excluir o usuário.');
    }
};

module.exports = {
    createUser,
    updateUser,
    deleteUserById
};
