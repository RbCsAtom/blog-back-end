const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// 注册路由: POST /api/users/register
router.post('/register', userController.register);

// 登录路由: POST /api/users/login
router.post('/login', userController.login);

module.exports = router;
