import { UserStatus } from '../../entities/userStatus.entity';
import { Rank } from '../../entities/rank.entity';
import { Task } from '../../entities/task.entity';
import { UserRoleEnum } from '../../entities/user.entity';

export class UserDto {
  readonly token: string;

  readonly username: string;

  readonly firstname: string;

  readonly lastname: string;

  readonly experience: number;

  readonly statusId: number;

  readonly status: UserStatus;

  readonly role: UserRoleEnum;

  readonly rankId: number;

  readonly rank: Rank;

  readonly tasks: Task[];

  readonly favouriteTasks: Task[];
}
