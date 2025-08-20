const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const uploadMiddleware = require('../middleware/upload');
const authMiddleware = require('../middleware/auth');

// POST /api/files/upload/:category - 上传单个文件到指定分类
// 例如: POST /api/files/upload/gallery
router.post(
  '/upload/:category', 
  authMiddleware, 
  uploadMiddleware.single('file'), // 'file' 是前端上传时表单字段的名称
  fileController.uploadFile
);

// GET /api/files/download/:category/:filename - 从指定分类下载文件
router.get(
  '/download/:category/:filename', 
  fileController.downloadFile
);

module.exports = router;
