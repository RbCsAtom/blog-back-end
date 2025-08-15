const db = require('../models');
const User = db.User;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 用户注册 (此部分保持不变)
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: '这个邮箱已经被注册了。' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword
    });
    res.status(201).json({ message: '用户注册成功！', userId: newUser.id });
  } catch (error) {
    res.status(500).json({ message: '服务器内部错误', error: error.message });
  }
};

// 用户登录 (此部分保持不变)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: '找不到该用户。' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: '密码不正确。' });
    }
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET || 'a_default_secret_key_that_should_be_changed',
      { expiresIn: '30d' }
    );
    res.status(200).json({
      message: '登录成功！',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: '服务器内部错误', error: error.message });
  }
};

// 获取当前登录用户的信息 (此部分保持不变)
exports.getInfo = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: { exclude: ['password'] }
    });
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }
    res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
    });
  } catch (error) {
    res.status(500).json({ message: '服务器内部错误', error: error.message });
  }
};

// --- 新增函数 ---
// 更新当前登录用户的信息
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.userId; // 从认证中间件获取用户ID
    const { username, avatar } = req.body; // 从请求体获取要更新的数据

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    // 更新用户信息 (只更新提供了的字段)
    if (username) {
      user.username = username;
    }
    if (avatar) {
      user.avatar = avatar;
    }

    await user.save(); // 保存更改到数据库

    // 返回更新后的用户信息（不含密码）
    res.status(200).json({
      message: '用户信息更新成功！',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar
      }
    });

  } catch (error) {
    res.status(500).json({ message: '服务器内部错误', error: error.message });
  }
};
