const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const uploadMiddleware = require('../middleware/upload');
const authMiddleware = require('../middleware/auth');

// POST /api/files/upload - 上传单个文件
// 1. 先通过登录验证 (authMiddleware)
// 2. 再处理文件上传 (uploadMiddleware.single('file'))
// 3. 最后由控制器返回结果 (fileController.uploadFile)
router.post(
  '/upload', 
  authMiddleware, 
  uploadMiddleware.single('file'), // 'file' 是前端上传时表单字段的名称
  fileController.uploadFile
);

// GET /api/files/download/:filename - 下载文件
router.get('/download/:filename', fileController.downloadFile);

module.exports = router;
