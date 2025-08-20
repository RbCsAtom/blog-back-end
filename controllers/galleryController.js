const db = require('../models');
const Gallery = db.gallery; // 使用你提供的 db.gallery
const { Op } = require('sequelize'); // 引入 Sequelize 操作符

/**
 * 创建新的画廊图片条目
 * 权限：仅限管理员 (userId: 1)
 */
exports.createGallery = async (req, res) => {
  // 权限校验已由 adminAuth 中间件处理
  try {
    const { 
      imageUrl, 
      title, 
      description, 
      category, 
      tags, 
      isPublic = true, // 默认为公开
      order = 0 // 默认排序权重为0
    } = req.body;

    // 验证核心字段是否存在
    if (!imageUrl || !title) {
      return res.status(400).json({ message: '图片URL (imageUrl) 和标题 (title) 是必填项。' });
    }

    const newGalleryItem = await Gallery.create({
      imageUrl,
      title,
      description,
      category,
      tags,
      isPublic,
      order,
      uploaderId: req.userId // uploaderId 来自 auth 中间件附加的 req.userId
    });

    res.status(201).json(newGalleryItem);
  } catch (error) {
    res.status(500).json({ message: '服务器内部错误', error: error.message });
  }
};

/**
 * 获取画廊图片列表 (公开)
 * 支持分页、按分类筛选、按标签搜索
 */
exports.getAllGallery = async (req, res) => {
  try {
    // 1. 分页参数
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12; // 每页默认12张图
    const offset = (page - 1) * limit;

    // 2. 构建查询条件
    const whereClause = {
      isPublic: true // 核心：只查询公开的图片
    };

    // 按分类筛选
    if (req.query.category) {
      whereClause.category = req.query.category;
    }

    // 按标签模糊搜索
    if (req.query.tag) {
      whereClause.tags = {
        [Op.like]: `%${req.query.tag}%`
      };
    }

    // 3. 执行查询
    const { count, rows } = await Gallery.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [['order', 'ASC'], ['createdAt', 'DESC']], // 按自定义排序权重、然后按创建时间排序
      // 关联查询上传者信息，但只选择安全字段
      include: [{
        model: db.user, // 使用你提供的 db.user
        as: 'uploader',
        attributes: ['id', 'username']
      }]
    });

    res.status(200).json({
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      galleries: rows
    });
  } catch (error) {
    res.status(500).json({ message: '服务器内部错误', error: error.message });
  }
};

/**
 * 获取单张图片的详细信息 (公开)
 */
exports.getGalleryInfo = async (req, res) => {
  try {
    const galleryItem = await Gallery.findOne({
      where: {
        id: req.params.id,
        isPublic: true // 确保只能获取到公开的图片
      },
      include: [{
        model: db.user,
        as: 'uploader',
        attributes: ['id', 'username']
      }]
    });

    if (!galleryItem) {
      return res.status(404).json({ message: '图片不存在或未公开。' });
    }

    res.status(200).json(galleryItem);
  } catch (error) {
    res.status(500).json({ message: '服务器内部错误', error: error.message });
  }
};

/**
 * 更新图片信息
 * 权限：仅限管理员 (userId: 1)
 */
exports.updateGallery = async (req, res) => {
  try {
    const galleryItem = await Gallery.findByPk(req.params.id);

    if (!galleryItem) {
      return res.status(404).json({ message: '要更新的图片不存在。' });
    }

    // 使用 body 中的数据更新实例
    // galleryItem.update 会忽略 body 中不存在的字段
    await galleryItem.update(req.body);

    res.status(200).json(galleryItem);
  } catch (error) {
    res.status(500).json({ message: '服务器内部错误', error: error.message });
  }
};


/**
 * 删除图片
 * 权限：仅限管理员 (userId: 1)
 */
exports.deleteGallery = async (req, res) => {
  try {
    const galleryItem = await Gallery.findByPk(req.params.id);

    if (!galleryItem) {
      return res.status(404).json({ message: '要删除的图片不存在。' });
    }

    await galleryItem.destroy();
    
    // 注意：这里只删除了数据库记录。
    // 如果图片文件存储在你的服务器或云存储上，你可能还需要在这里添加代码来删除物理文件。
    res.status(200).json({ message: '图片删除成功。' });
  } catch (error) {
    res.status(500).json({ message: '服务器内部错误', error: error.message });
  }
};