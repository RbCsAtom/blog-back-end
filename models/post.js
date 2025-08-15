'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {
      // 定义 Post 与 User 的关联关系
      // 一篇文章 (Post) 属于一个用户 (User)
      Post.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'author' // 别名
      });
    }
  }
  Post.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT, // 使用 TEXT 类型以存储长篇文章
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users', // 关联到 Users 表
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};
