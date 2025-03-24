import { UserStatus } from '../../entities/userStatus.entity';
import { Rank } from '../../entities/rank.entity';
import { User, UserRoleEnum } from '../../entities/user.entity';

export class UserClientModel {
  constructor(user: User) {
    this.token = user.token;
    this.username = user.username;
    this.firstname = user.firstname;
    this.lastname = user.lastname;
    this.experience = user.experience;
    this.status = user.status;
    this.role = user.role;
    this.rank = user.rank;
  }

  readonly token: string;

  readonly username: string;

  readonly firstname: string;

  readonly lastname: string;

  readonly experience: number;

  readonly status: UserStatus;

  readonly role: UserRoleEnum;

  readonly rank: Rank;
}
