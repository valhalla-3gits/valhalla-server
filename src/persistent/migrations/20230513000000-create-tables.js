'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create UserStatus table
    await queryInterface.createTable('UserStatuses', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING(32),
        allowNull: false,
        unique: true,
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

    // Create Rank table
    await queryInterface.createTable('Ranks', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      token: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(32),
        allowNull: false,
        unique: true,
      },
      number: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      value: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      targetValue: {
        type: Sequelize.INTEGER,
        allowNull: false,
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

    // Create Language table
    await queryInterface.createTable('Languages', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      token: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(32),
        allowNull: false,
        unique: true,
      },
      shortName: {
        type: Sequelize.STRING(16),
        allowNull: false,
      },
      mainFile: {
        type: Sequelize.STRING(16),
        allowNull: false,
      },
      image: {
        type: Sequelize.STRING(32),
        allowNull: false,
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

    // Create User table
    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      token: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      username: {
        type: Sequelize.STRING(64),
        allowNull: false,
        unique: true,
      },
      firstname: {
        type: Sequelize.STRING(64),
        allowNull: true,
      },
      lastname: {
        type: Sequelize.STRING(64),
        allowNull: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      experience: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      statusId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        references: {
          model: 'UserStatuses',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      role: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      rankId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
        references: {
          model: 'Ranks',
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

    // Create Task table
    await queryInterface.createTable('Tasks', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      token: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(64),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      prototype: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      examples: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      authorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      languageId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Languages',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      rankId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Ranks',
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

    // Create Test table
    await queryInterface.createTable('Tests', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      token: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(64),
        allowNull: false,
      },
      test: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      test_header: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      test_result: {
        type: Sequelize.STRING(64),
        allowNull: false,
      },
      task_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
        references: {
          model: 'Tasks',
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

    // Create SolvedTask table
    await queryInterface.createTable('SolvedTasks', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      token: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      solution: {
        type: Sequelize.TEXT,
        allowNull: false,
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
      taskId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Tasks',
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

    // Create FavouriteTask table
    await queryInterface.createTable('FavouriteTasks', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
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
      taskId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Tasks',
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
  },

  down: async (queryInterface, Sequelize) => {
    // Drop tables in reverse order to avoid foreign key constraints
    await queryInterface.dropTable('FavouriteTasks');
    await queryInterface.dropTable('SolvedTasks');
    await queryInterface.dropTable('Tests');
    await queryInterface.dropTable('Tasks');
    await queryInterface.dropTable('Users');
    await queryInterface.dropTable('Languages');
    await queryInterface.dropTable('Ranks');
    await queryInterface.dropTable('UserStatuses');
  }
};