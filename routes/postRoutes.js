const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/auth');
const adminAuthMiddleware = require('../middleware/adminAuth');

// --- 公开路由 (所有人可访问) ---
router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPostById);

// --- 受保护的管理员路由 ---
// 创建文章: 需要先通过登录验证，再通过管理员验证
router.post('/', authMiddleware, adminAuthMiddleware, postController.createPost);

// 更新文章: 需要先通过登录验证，再通过管理员验证
router.put('/:id', authMiddleware, adminAuthMiddleware, postController.updatePost);

// 删除文章: 需要先通过登录验证，再通过管理员验证
router.delete('/:id', authMiddleware, adminAuthMiddleware, postController.deletePost);

module.exports = router;
