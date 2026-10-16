'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return await queryInterface.bulkInsert('Categories', [
      { name: 'General', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Sports', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Technology', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Entertainment', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Politics', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Business', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Science', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Health', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Education', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Travel', createdAt: new Date(), updatedAt: new Date() }
    ])
  },

  async down(queryInterface, Sequelize) {
    return await queryInterface.bulkDelete('Categories', null, {});
  }
};
