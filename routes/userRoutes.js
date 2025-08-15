const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth'); // 1. 引入认证中间件

// 公开路由 (无需登录)
router.post('/register', userController.register);
router.post('/login', userController.login);

// --- 受保护的路由 (需要有效的 Token 才能访问) ---

// 获取当前登录用户的信息
router.get('/info', authMiddleware, userController.getInfo);

// 更新当前登录用户的信息
router.post('/profile', authMiddleware, userController.updateProfile);

module.exports = router;
