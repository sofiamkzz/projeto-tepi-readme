const express = require('express');
const { getLoginPage, loginUser, logoutUser } = require('../controllers/authController');
const router = express.Router();

router.get('/login', getLoginPage);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

module.exports = router;