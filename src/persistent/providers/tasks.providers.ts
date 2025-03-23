import { TASKS_REPOSITORY } from '../../core/constants';
import { Task } from '../../core/models/entities/task.entity';

export const tasksProviders = [
  {
    provide: TASKS_REPOSITORY,
    useValue: Task,
  },
];
