import { SOLVED_TASKS_REPOSITORY } from '../../core/constants';
import { SolvedTask } from '../../core/models/entities/solvedTask.entity';

export const solvedTasksProviders = [
  {
    provide: SOLVED_TASKS_REPOSITORY,
    useValue: SolvedTask,
  },
];
