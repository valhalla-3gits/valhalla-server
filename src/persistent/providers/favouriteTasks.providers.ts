import { FAVOURITE_TASKS_REPOSITORY } from '../../core/constants';
import { FavouriteTask } from '../../core/models/entities/favouriteTask.entity';

export const favouriteTasksProviders = [
  {
    provide: FAVOURITE_TASKS_REPOSITORY,
    useValue: FavouriteTask,
  },
];
