'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('UserStatuses', [
      {
        id: 0,
        name: 'active',
        createdAt: new Date('2025-03-24T12:48:50.114Z'),
        updatedAt: new Date('2025-03-24T12:48:50.114Z')
      },
      {
        id: 1,
        name: 'deleted',
        createdAt: new Date('2025-03-24T12:48:50.114Z'),
        updatedAt: new Date('2025-03-24T12:48:50.114Z')
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('UserStatuses', null, {});
  }
};