const db = require('../models');
const Post = db.Post;
const User = db.User;
const Tag = db.Tag; // 引入 Tag 模型
const { Op } = require('sequelize'); // 引入 Sequelize 操作符

// 创建新文章
exports.createPost = async (req, res) => {
  try {
    const { title, content, tagIds } = req.body; // 接收一个 tagIds 数组
    const userId = req.userId;

    const newPost = await Post.create({ title, content, userId });

    // 如果提供了 tagIds，则建立关联
    if (tagIds && tagIds.length > 0) {
      await newPost.setTags(tagIds);
    }

    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: '服务器内部错误', error: error.message });
  }
};

// 获取所有文章列表 (支持分页、搜索、标签筛选)
exports.getAllPosts = async (req, res) => {
  try {
    // 1. 分页参数
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // 2. 动态构建查询条件
    const whereClause = {};
    const includeClause = [
        { model: User, as: 'author', attributes: ['id', 'username', 'avatar'] },
        { model: Tag, as: 'tags', through: { attributes: [] } }
    ];

    // 标题模糊搜索
    if (req.query.title) {
      whereClause.title = {
        [Op.iLike]: `%${req.query.title}%` // iLike 表示不区分大小写的模糊匹配
      };
    }

    // 标签筛选 (支持多个标签, e.g., ?tags=1,2)
    if (req.query.tags) {
      const tagIds = req.query.tags.split(',').map(id => parseInt(id));
      includeClause[1].where = {
          id: { [Op.in]: tagIds }
      };
      // 必须包含标签才能出现在结果中
      includeClause[1].required = true;
    }

    const { count, rows } = await Post.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      include: includeClause,
      order: [['createdAt', 'DESC']],
      distinct: true, // 关键：确保在多对多关联筛选时计数正确
    });

    res.status(200).json({ total: count, posts: rows });
  } catch (error) {
    res.status(500).json({ message: '服务器内部错误', error: error.message });
  }
};

// 获取单篇文章详情
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: [
        { model: User, as: 'author', attributes: ['id', 'username', 'avatar'] },
        { model: Tag, as: 'tags', through: { attributes: [] } } // 包含关联的标签
      ]
    });
    if (!post) {
      return res.status(404).json({ message: '文章不存在' });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: '服务器内部错误', error: error.message });
  }
};

// 更新文章
exports.updatePost = async (req, res) => {
  try {
    const { title, content, tagIds } = req.body; // 接收 tagIds 数组
    const post = await Post.findByPk(req.params.id);

    if (!post) {
      return res.status(404).json({ message: '文章不存在' });
    }

    post.title = title || post.title;
    post.content = content || post.content;
    await post.save();

    // 如果提供了 tagIds，则更新关联关系
    if (tagIds) {
      await post.setTags(tagIds);
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: '服务器内部错误', error: error.message });
  }
};

// 删除文章 (保持不变)
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