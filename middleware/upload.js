const multer = require('multer');
const path = require('path');

// 1. 定义允许的文件类型
const allowedFileTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt/;

// 2. 配置存储引擎
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // 设置文件存储的目录
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // 设置文件名，防止重名：字段名 + 时间戳 + 原始扩展名
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// 3. 创建 Multer 实例并应用配置
const upload = multer({
  storage: storage,
  limits: {
    // 限制文件大小为 10MB
    fileSize: 10 * 1024 * 1024 // 10MB in bytes
  },
  fileFilter: function (req, file, cb) {
    // 检查文件扩展名和 MIME 类型
    const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedFileTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('错误：只允许上传图片和文档类型的文件！'));
    }
  }
});

module.exports = upload;
