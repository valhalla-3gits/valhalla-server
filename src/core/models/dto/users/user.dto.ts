import { UserStatus } from '../../entities/userStatus.entity';
import { User, UserRoleEnum } from '../../entities/user.entity';
import { TaskDto } from '../tasks/task.dto';
import { RankDto } from '../ranks/rank.dto';

export class UserDto {
  constructor(user: User) {
    this.token = user.token;
    this.username = user.username;
    this.firstname = user.firstname;
    this.lastname = user.lastname;
    this.experience = user.experience;
    this.rank = new RankDto(user.rank);
    this.tasks = user.tasks?.map((t) => new TaskDto(t)) ?? [];
    this.favouriteTasks = user.favouriteTasks?.map((t) => new TaskDto(t)) ?? [];
  }

  readonly token: string;

  readonly username: string;

  readonly firstname: string;

  readonly lastname: string;

  readonly experience: number;

  // readonly statusId: number;
  //
  // readonly status: UserStatus;

  // readonly role: UserRoleEnum;

  readonly rank: RankDto;

  readonly tasks: TaskDto[];

  readonly favouriteTasks: TaskDto[];
}
