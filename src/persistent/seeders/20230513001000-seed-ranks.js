'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Ranks', [
      {
        id: 0,
        token: uuidv4(),
        name: 'First',
        number: 0,
        value: 100,
        targetValue: 2000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 1,
        token: uuidv4(),
        name: 'Second',
        number: 1,
        value: 200,
        targetValue: 4000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        token: uuidv4(),
        name: 'Third',
        number: 2,
        value: 400,
        targetValue: 8000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        token: uuidv4(),
        name: 'Fourth',
        number: 3,
        value: 600,
        targetValue: 16000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        token: uuidv4(),
        name: 'Fifth',
        number: 4,
        value: 1000,
        targetValue: 32000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 5,
        token: uuidv4(),
        name: 'Sixth',
        number: 5,
        value: 1600,
        targetValue: 64000,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Ranks', null, {});
  }
};