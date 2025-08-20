'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Gallery extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // A Gallery item belongs to a User
      Gallery.belongsTo(models.User, {
        foreignKey: 'uploaderId',
        as: 'uploader' // 定义一个别名，方便查询时使用
      });
    }
  }
  Gallery.init({
    imageUrl: DataTypes.STRING,
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    category: DataTypes.STRING,
    uploaderId: DataTypes.INTEGER,
    isPublic: DataTypes.BOOLEAN,
    order: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Gallery',
  });
  return Gallery;
};