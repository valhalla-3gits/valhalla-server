'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create Tokens table
    await queryInterface.createTable('Tokens', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      token: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM('access', 'refresh'),
        allowNull: false,
      },
      expiresAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      revoked: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    // Add index for faster token lookups
    await queryInterface.addIndex('Tokens', ['token']);
    
    // Add index for faster user token lookups
    await queryInterface.addIndex('Tokens', ['userId', 'type', 'revoked']);
  },

  down: async (queryInterface, Sequelize) => {
    // Drop Tokens table
    await queryInterface.dropTable('Tokens');
  }
};