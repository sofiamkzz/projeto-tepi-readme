const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const User = require('../models/user');

const createUser = async (req, res) => {
    const { name, email, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('cadastro', { mensagem: errors.array()[0].msg });
    }

    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.render('cadastro', { mensagem: 'Usuário já existe.' });
        }

        await User.create({ name, email, password});

        res.redirect('/login');
    } catch (error) {
        console.error('Erro ao inserir usuário:', error);
        res.render('cadastro', { mensagem: 'Erro ao cadastrar usuário.' });
    }
};

const updateUser = async (req, res) => {
    const { newName, newEmail, newPassword } = req.body;

    try {
        const user = await User.findByPk(req.session.userId);

        if (!user) {
            return res.status(404).send('Usuário não encontrado.');
        }

        if (newEmail && newEmail !== user.email) {
            const existingEmailUser = await User.findOne({ where: { email: newEmail } });
            if (existingEmailUser) {
                return res.render('conta', { user: user, mensagem: 'Este e-mail já está em uso.' });
            }
            user.email = newEmail;
        }

        if (newName) {
            user.name = newName;
        }

        if (newPassword) {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
        }

        await user.save();

        res.render('conta', { user: user, mensagem: 'Dados atualizados com sucesso!' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao atualizar os dados.' });
    }
};

const deleteUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).send('Usuário não encontrado.');
        }

        await user.destroy();
        console.log(`Usuário com ID ${id} deletado com sucesso.`);

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