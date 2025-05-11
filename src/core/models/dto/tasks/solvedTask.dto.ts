import { UserDto } from '../users/user.dto';
import { TaskDto } from './task.dto';
import { SolvedTask } from '../../entities/solvedTask.entity';

export class SolvedTaskDto {
  constructor(solvedTask: SolvedTask) {
    this.token = solvedTask.token;
    this.solution = solvedTask.solution;
    this.user = new UserDto(solvedTask.user);
    this.task = new TaskDto(solvedTask.task);
  }

  readonly token: string;
  readonly solution: string;
  readonly user: UserDto;
  readonly task: TaskDto;
}
