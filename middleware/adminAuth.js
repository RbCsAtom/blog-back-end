module.exports = (req, res, next) => {
  // 这个中间件必须在通用的 auth.js 中间件之后使用
  // req.userId 是由 auth.js 附加的
  if (req.userId !== 1) {
    return res.status(403).json({ message: '权限不足：只有管理员才能执行此操作。' });
  }
  next(); // 是管理员，放行
};
