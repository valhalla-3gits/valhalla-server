import { UserStatus } from '../../entities/userStatus.entity';
import { User, UserRoleEnum } from '../../entities/user.entity';
import { TaskDto } from '../tasks/task.dto';
import { RankDto } from '../ranks/rank.dto';

export class UserUpdateDto {
  readonly token: string;

  readonly username: string;

  readonly firstname: string;

  readonly lastname: string;

  readonly experience: number;

  readonly statusId: number;

  readonly status: UserStatus;

  readonly role: UserRoleEnum;

  readonly rank: RankDto;

  readonly tasks: TaskDto[];

  readonly favouriteTasks: TaskDto[];
}
