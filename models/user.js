'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // --- 正确的关联关系 ---
      // 一个用户 (User) 可以有多篇文章 (Post)
      User.hasMany(models.Post, {
        foreignKey: 'userId',
        as: 'posts'
      });
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
