const db = require('../models');
const Post = db.Post;
const User = db.User;

// 创建新文章 (仅限管理员)
exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.userId; // 从 auth 中间件获取

    const newPost = await Post.create({ title, content, userId });
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: '服务器内部错误', error: error.message });
  }
};

// 获取所有文章列表 (公开)
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'username', 'avatar'] // 只返回作者的部分信息
      }],
      order: [['createdAt', 'DESC']] // 按创建时间降序排序
    });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: '服务器内部错误', error: error.message });
  }
};

// 获取单篇文章详情 (公开)
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

// 更新文章 (仅限管理员)
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

// 删除文章 (仅限管理员)
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
