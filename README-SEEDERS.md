# Database Seeders Setup

This document provides an overview of the database seeders setup for the Valhalla Server project.

## Changes Made

1. Created Sequelize seeder files from the db/seed.sql script:
   - `src/persistent/seeders/20230513001000-seed-ranks.js`: Seeds the Ranks table
   - `src/persistent/seeders/20230513002000-seed-user-statuses.js`: Seeds the UserStatuses table
   - `src/persistent/seeders/20230513003000-seed-languages.js`: Seeds the Languages table

2. Created documentation for the seeders:
   - `src/persistent/seeders/README.md`: Provides instructions on how to run and undo seeders

## Data Conversion

The original SQL INSERT statements from `db/seed.sql` have been converted to Sequelize seeder format:

1. SQL functions have been replaced with JavaScript equivalents:
   - `gen_random_uuid()` → `uuidv4()` from the uuid package
   - `CURRENT_TIMESTAMP` → `new Date()`

2. Fixed timestamps in the UserStatuses seeder have been preserved using JavaScript Date objects.

## Running the Seeders

To run all seeders and populate the database:

```bash
npx sequelize-cli db:seed:all
```

To run a specific seeder:

```bash
npx sequelize-cli db:seed --seed 20230513001000-seed-ranks.js
```

## Dependencies

These seeders require the `uuid` package to generate UUIDs. Install it using:

```bash
npm install uuid
```

or

```bash
yarn add uuid
```

## Workflow

The recommended workflow is:

1. Run migrations to create the database tables:
   ```bash
   npx sequelize-cli db:migrate
   ```

2. Run seeders to populate the tables with initial data:
   ```bash
   npx sequelize-cli db:seed:all
   ```

## Reverting Changes

To undo all seeders:

```bash
npx sequelize-cli db:seed:undo:all
```

To undo migrations:

```bash
npx sequelize-cli db:migrate:undo:all
```

## Next Steps

After running the seeders, you may want to:

1. Create additional seeders for other tables
2. Update the application code to use the seeded data
3. Create tests to verify the seeded data is correctly accessible through the application