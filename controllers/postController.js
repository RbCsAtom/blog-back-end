const db = require('../models');
const Post = db.Post;
const User = db.User;

// ... createPost, getPostById, updatePost, deletePost 函数保持不变 ...

// 获取所有文章列表 (公开, 支持分页)
exports.getAllPosts = async (req, res) => {
  try {
    // 1. 从查询参数获取分页信息，提供默认值
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // 2. 使用 findAndCountAll 来同时获取总数和当前页的数据
    const { count, rows } = await Post.findAndCountAll({
      limit,
      offset,
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'username', 'avatar']
      }],
      order: [['createdAt', 'DESC']]
    });

    // 3. 返回包含总数和文章列表的对象
    res.status(200).json({
      total: count,
      posts: rows
    });
  } catch (error) {
    res.status(500).json({ message: '服务器内部错误', error: error.message });
  }
};

// ... 其他函数 ...
exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.userId;
    const newPost = await Post.create({ title, content, userId });
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: '服务器内部错误', error: error.message });
  }
};
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'username', 'avatar']
      }]
    });
    if (!post) {
      return res.status(404).json({ message: '文章不存在' });
    }
    res.status(200).json(post);
  } catch (error)
 {
    res.status(500).json({ message: '服务器内部错误', error: error.message });
  }
};
exports.updatePost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = await Post.findByPk(req.params.id);
    if (!post) {
      return res.status(404).json({ message: '文章不存在' });
    }
    post.title = title || post.title;
    post.content = content || post.content;
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: '服务器内部错误', error: error.message });
  }
};
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) {
      return res.status(404).json({ message: '文章不存在' });
    }
    await post.destroy();
    res.status(200).json({ message: '文章删除成功' });
  } catch (error) {
    res.status(500).json({ message: '服务器内部错误', error: error.message });
  }
};
