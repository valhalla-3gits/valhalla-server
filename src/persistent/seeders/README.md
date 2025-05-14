# Database Seeders

This directory contains database seeders for the Valhalla Server project. These seeders populate the database with initial data.

## Seeders Overview

The following seeders are available:

1. **20230513001000-seed-ranks.js**: Seeds the `Ranks` table with 6 ranks (First through Sixth).
2. **20230513002000-seed-user-statuses.js**: Seeds the `UserStatuses` table with 2 statuses (active and deleted).
3. **20230513003000-seed-languages.js**: Seeds the `Languages` table with 6 programming languages (C, Cpp, Python, JavaScript, TypeScript, Rust).

## Running Seeders

To run all seeders:

```bash
npx sequelize-cli db:seed:all
```

To run a specific seeder:

```bash
npx sequelize-cli db:seed --seed 20230513001000-seed-ranks.js
```

## Undoing Seeders

To undo the most recent seeder:

```bash
npx sequelize-cli db:seed:undo
```

To undo a specific seeder:

```bash
npx sequelize-cli db:seed:undo --seed 20230513001000-seed-ranks.js
```

To undo all seeders:

```bash
npx sequelize-cli db:seed:undo:all
```

## Dependencies

These seeders use the `uuid` package to generate UUIDs for the token fields. Make sure it's installed:

```bash
npm install uuid
```

or

```bash
yarn add uuid
```

## Notes

- The seeders are designed to be run after the migrations have been applied.
- The seeders use fixed IDs to ensure consistency with the original data.
- The timestamps for the `UserStatuses` table are set to a specific date (2025-03-24), while the timestamps for the other tables are set to the current date and time when the seeder is run.