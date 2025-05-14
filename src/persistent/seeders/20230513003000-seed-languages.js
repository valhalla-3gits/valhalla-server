'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Languages', [
      {
        id: 0,
        token: uuidv4(),
        name: 'C',
        shortName: 'C',
        mainFile: 'main.c',
        image: 'clang',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 1,
        token: uuidv4(),
        name: 'Cpp',
        shortName: 'Cpp',
        mainFile: 'main.cpp',
        image: 'clang',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        token: uuidv4(),
        name: 'Python',
        shortName: 'Py',
        mainFile: 'main.py',
        image: 'python',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        token: uuidv4(),
        name: 'JavaScript',
        shortName: 'JS',
        mainFile: 'main.js',
        image: 'javascript',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        token: uuidv4(),
        name: 'TypeScript',
        shortName: 'TS',
        mainFile: 'main.ts',
        image: 'typescript',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 5,
        token: uuidv4(),
        name: 'Rust',
        shortName: 'Rs',
        mainFile: 'main.rs',
        image: 'rust',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Languages', null, {});
  }
};