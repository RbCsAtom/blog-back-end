    'use strict';
    const {
      Model
    } = require('sequelize');
    module.exports = (sequelize, DataTypes) => {
      class Tag extends Model {
        static associate(models) {
          // --- 新增代码 ---
          Tag.belongsToMany(models.Post, {
            through: 'PostTag', // 通过 PostTag 中间表
            foreignKey: 'tagId',
            as: 'posts'
          });
        }
      }
      // ... Tag.init 部分保持不变 ...
      Tag.init({
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true
        }
      }, {
        sequelize,
        modelName: 'Tag',
      });
      return Tag;
    };
    