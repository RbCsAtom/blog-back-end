'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 使用 addColumn 方法向 Users 表添加 avatar 字段
    await queryInterface.addColumn('Users', 'avatar', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
      after: 'email' // 可选：指定字段添加在哪个字段后面
    });
  },

  async down(queryInterface, Sequelize) {
    // 定义如何撤销迁移，即移除 avatar 字段
    await queryInterface.removeColumn('Users', 'avatar');
  }
};
