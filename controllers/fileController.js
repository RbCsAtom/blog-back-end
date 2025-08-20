const path = require('path');

// 处理文件上传成功后的响应
exports.uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: '请选择一个文件上传。' });
  }

  // 从 req.file.path 构建可访问的 URL (将 Windows 的 \ 替换为 /)
  const fileUrl = `/${req.file.path.replace(/\\/g, '/')}`;
  
  res.status(201).json({
    message: '文件上传成功！',
    url: fileUrl,
    filename: req.file.filename
  });
};

// 处理文件下载
exports.downloadFile = (req, res) => {
  const { category, filename } = req.params;
  // 构建文件的绝对路径，现在包含 category
  const filePath = path.join(__dirname, '..', 'uploads', category, filename);

  // 使用 res.download() 方法来提供文件下载
  res.download(filePath, (err) => {
    if (err) {
      // 如果文件不存在或发生其他错误
      res.status(404).json({ message: '错误：找不到该文件。' });
    }
  });
};
