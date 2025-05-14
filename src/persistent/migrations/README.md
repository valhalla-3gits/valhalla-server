# Database Migrations

This directory contains database migrations for the Valhalla Server project.

## Running Migrations

To run the migrations, you need to have Sequelize CLI installed. You can install it globally using:

```bash
npm install -g sequelize-cli
```

or

```bash
yarn global add sequelize-cli
```

### Running Migrations

To run all pending migrations:

```bash
npx sequelize-cli db:migrate
```

### Reverting Migrations

To revert the most recent migration:

```bash
npx sequelize-cli db:migrate:undo
```

To revert all migrations:

```bash
npx sequelize-cli db:migrate:undo:all
```

### Creating New Migrations

To create a new migration:

```bash
npx sequelize-cli migration:generate --name migration-name
```

## Migration File Structure

Each migration file exports two functions:

1. `up`: This function is called when the migration is applied. It should create tables, add columns, etc.
2. `down`: This function is called when the migration is reverted. It should undo the changes made by the `up` function.

Example:

```javascript
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add table or modify schema
  },

  down: async (queryInterface, Sequelize) => {
    // Revert changes
  }
};
```