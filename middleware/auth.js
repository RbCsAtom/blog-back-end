const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // 从请求头获取 token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: '认证失败: 请求头缺少有效的 Token' });
    }

    const token = authHeader.split(' ')[1];

    // 验证 token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'a_default_secret_key_that_should_be_changed');
    
    // 将解码后的用户 ID 附加到请求对象上，供后续的控制器使用
    req.userId = decoded.id;
    
    next(); // Token 有效，放行请求
  } catch (error) {
    // Token 无效或过期
    res.status(401).json({ message: '认证失败: Token 无效或已过期' });
  }
};
