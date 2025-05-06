import { Sequelize, SequelizeOptions } from 'sequelize-typescript';
import { SEQUELIZE, DEVELOPMENT, TEST, PRODUCTION } from '../constants';
import { databaseConfig } from './database.config';
import { SolvedTask } from '../models/entities/solvedTask.entity';
import { UserStatus } from '../models/entities/userStatus.entity';
import { Rank } from '../models/entities/rank.entity';
import { Language } from '../models/entities/language.entity';
import { Task } from '../models/entities/task.entity';
import { User } from '../models/entities/user.entity';
import { FavouriteTask } from '../models/entities/favouriteTask.entity';
import { IDatabaseConfigAttributes } from './interfaces/dbConfig.interface';
import { Test } from '../models/entities/tests.entity';

export const databaseProviders = [
  {
    provide: SEQUELIZE,
    useFactory: async () => {
      let config: IDatabaseConfigAttributes;
      switch (process.env.NODE_ENV) {
        case DEVELOPMENT:
          config = databaseConfig.development;
          break;
        case TEST:
          config = databaseConfig.test;
          break;
        case PRODUCTION:
          config = databaseConfig.production;
          break;
        default:
          config = databaseConfig.development;
      }
      const sequelize = new Sequelize(config as SequelizeOptions);
      sequelize.addModels([
        User,
        Task,
        FavouriteTask,
        Language,
        Rank,
        SolvedTask,
        UserStatus,
        Test,
      ]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
