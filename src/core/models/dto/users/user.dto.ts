import { UserStatus } from '../../entities/userStatus.entity';
import { UserRole } from '../../entities/userRole.entity';
import { Rank } from '../../entities/rank.entity';
import { Task } from '../../entities/task.entity';

export enum UserStatusEnum {
  ACTIVE = 0,
  DELETED = 1,
  DISABLED = 2,
}

export enum RanksEnum {
  FIRST = 0,
  SECOND = 1,
  THIRD = 2,
  FOURTH = 3,
  FIFTH = 4,
  SIXTH = 5,
}

export class UserDto {
  readonly token: string;

  readonly username: string;

  readonly firstname: string;

  readonly lastname: string;

  readonly experience: number;

  readonly statusId: number;

  readonly status: UserStatus;

  readonly roleId: number;

  readonly role: UserRole;

  readonly rankId: number;

  readonly rank: Rank;

  readonly tasks: Task[];

  readonly favouriteTasks: Task[];
}
