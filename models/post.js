    'use strict';
    const {
      Model
    } = require('sequelize');
    module.exports = (sequelize, DataTypes) => {
      class Post extends Model {
        static associate(models) {
          Post.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'author'
          });
          // --- 新增代码 ---
          Post.belongsToMany(models.Tag, {
            through: 'PostTag', // 通过 PostTag 中间表
            foreignKey: 'postId',
            as: 'tags'
          });
        }
      }
      // ... Post.init 部分保持不变 ...
      Post.init({
        title: {
          type: DataTypes.STRING,
          allowNull: false
        },
        content: {
          type: DataTypes.TEXT,
          allowNull: false
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'Users',
            key: 'id'
          }
        }
      }, {
        sequelize,
        modelName: 'Post',
      });
      return Post;
    };
    