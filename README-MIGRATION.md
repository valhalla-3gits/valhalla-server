# Database Migration Setup

This document provides an overview of the database migration setup for the Valhalla Server project.

## Changes Made

1. Created a Sequelize migration file to add all tables with their columns to the PostgreSQL database:
   - `src/persistent/migrations/20230513000000-create-tables.js`

2. Created a Sequelize configuration file to enable running migrations:
   - `src/persistent/config.ts`

3. Created a proper `.sequelizerc` file to replace the `.sequelizerc.fuck` file:
   - `.sequelizerc`

4. Created directories for migrations and seeders:
   - `src/persistent/migrations/`
   - `src/persistent/seeders/`

5. Added documentation on how to run migrations:
   - `src/persistent/migrations/README.md`

## Database Schema

The migration creates the following tables:

1. **UserStatuses**: Stores user status information (ACTIVE, DELETED, DISABLED)
2. **Ranks**: Stores rank information for users and tasks
3. **Languages**: Stores programming language information
4. **Users**: Stores user information with references to UserStatus and Rank
5. **Tasks**: Stores task information with references to User (author), Language, and Rank
6. **Tests**: Stores test information with references to Task
7. **SolvedTasks**: Stores information about tasks solved by users with references to User and Task
8. **FavouriteTasks**: Stores information about tasks favorited by users with references to User and Task

## Running the Migration

To run the migration and create all tables in the database:

1. Make sure you have Sequelize CLI installed:
   ```bash
   npm install -g sequelize-cli
   ```
   or
   ```bash
   yarn global add sequelize-cli
   ```

2. Run the migration:
   ```bash
   npx sequelize-cli db:migrate
   ```

This will create all the tables in the PostgreSQL database as defined in the migration file.

## Reverting the Migration

If you need to revert the migration:

```bash
npx sequelize-cli db:migrate:undo
```

## Next Steps

After running the migration, you may want to:

1. Seed the database with initial data
2. Update the application code to use the new database schema
3. Create additional migrations for future schema changes