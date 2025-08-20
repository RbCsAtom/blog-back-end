const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/gallery.controller'); // 确保路径正确
const auth = require('../middleware/auth'); // 引入通用认证中间件
const adminAuth = require('../middleware/adminAuth'); // 引入管理员认证中间件

// --- 定义画廊 API 路由 ---

// 1. 上传/创建新的画廊图片 (POST /api/gallery)
// 需要登录(auth) 且必须是管理员(adminAuth)
router.post(
  '/', 
  auth, adminAuth,
  galleryController.createGallery
);

// 2. 获取画廊图片列表 (GET /api/gallery)
// 公开接口，任何人都可以访问
router.get(
  '/', 
  galleryController.getAllGallery
);

// 3. 获取单张图片详情 (GET /api/gallery/:id)
// 公开接口
router.get(
  '/:id', 
  galleryController.getGalleryInfo
);

// 4. 更新图片信息 (PUT /api/gallery/:id)
// 需要登录(auth) 且必须是管理员(adminAuth)
router.put(
  '/:id', 
  auth, adminAuth,
  galleryController.updateGallery
);

// 5. 删除图片 (DELETE /api/gallery/:id)
// 需要登录(auth) 且必须是管理员(adminAuth)
router.delete(
  '/:id', 
  auth, adminAuth, 
  galleryController.deleteGallery
);

module.exports = router;
