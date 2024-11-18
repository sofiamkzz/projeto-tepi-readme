const isAdmin = (req, res, next) => {
    if (req.session.userRole === 'admin')
        return next();
    }
    res.status(403).send('Acesso proibido');
};

module.exports = isAdmin;
