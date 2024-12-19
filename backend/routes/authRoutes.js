const express = require('express');
const router = express.Router();
const { login , registerUser } = require('../controllers/authController');

// Route đăng nhập
router.post('/login', login);

// Route đăng ký
router.post('/register', registerUser);

module.exports = router;
