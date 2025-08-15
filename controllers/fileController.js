const path = require('path');

// 处理文件上传成功后的响应
exports.uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: '请选择一个文件上传。' });
  }

  // 文件上传成功，返回文件的访问路径
  // 注意：这里的路径是前端访问的 URL 路径，而不是服务器上的物理路径
  const fileUrl = `/uploads/${req.file.filename}`;
  
  res.status(201).json({
    message: '文件上传成功！',
    url: fileUrl,
    filename: req.file.filename
  });
};

// 处理文件下载
exports.downloadFile = (req, res) => {
  const filename = req.params.filename;
  // 构建文件的绝对路径
  const filePath = path.join(__dirname, '..', 'uploads', filename);

  // 使用 res.download() 方法来提供文件下载
  res.download(filePath, (err) => {
    if (err) {
      // 如果文件不存在或发生其他错误
      res.status(404).json({ message: '错误：找不到该文件。' });
    }
  });
};
