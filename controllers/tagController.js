const db = require('../models');
const Tag = db.Tag;

// 获取所有标签 (公开, 支持分页)
exports.getAllTags = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10; // 默认每页 10 条
    const offset = (page - 1) * limit;

    const { count, rows } = await Tag.findAndCountAll({
      limit,
      offset,
      order: [['name', 'ASC']] // 按名称升序排序
    });
    
    res.status(200).json({
      total: count,
      tags: rows
    });
  } catch (error) {
    res.status(500).json({ message: '服务器内部错误', error: error.message });
  }
};

// 创建新标签 (仅限管理员)
exports.createTag = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: '标签名称不能为空' });
    }
    const newTag = await Tag.create({ name });
    res.status(201).json(newTag);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: '该标签已存在' });
    }
    res.status(500).json({ message: '服务器内部错误', error: error.message });
  }
};

// 更新标签 (仅限管理员)
exports.updateTag = async (req, res) => {
  try {
    const { name } = req.body;
    const tag = await Tag.findByPk(req.params.id);

    if (!tag) {
      return res.status(404).json({ message: '标签不存在' });
    }

    tag.name = name || tag.name;
    await tag.save();

    res.status(200).json(tag);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: '该标签已存在' });
    }
    res.status(500).json({ message: '服务器内部错误', error: error.message });
  }
};

// 删除标签 (仅限管理员)
exports.deleteTag = async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id);
    if (!tag) {
      return res.status(404).json({ message: '标签不存在' });
    }
    await tag.destroy();
    res.status(200).json({ message: '标签删除成功' });
  } catch (error) {
    res.status(500).json({ message: '服务器内部错误', error: error.message });
  }
};