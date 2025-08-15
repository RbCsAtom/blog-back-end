const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tagController');
const authMiddleware = require('../middleware/auth');
const adminAuthMiddleware = require('../middleware/adminAuth');

// --- 公开路由 ---
// 获取所有标签
router.get('/', tagController.getAllTags);

// --- 受保护的管理员路由 ---
// 创建新标签
router.post('/', authMiddleware, adminAuthMiddleware, tagController.createTag);

// 更新标签
router.put('/:id', authMiddleware, adminAuthMiddleware, tagController.updateTag);

// 删除标签
router.delete('/:id', authMiddleware, adminAuthMiddleware, tagController.deleteTag);

module.exports = router;
