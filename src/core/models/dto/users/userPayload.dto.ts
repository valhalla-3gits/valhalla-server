import { User, UserRoleEnum } from '../../entities/user.entity';

export class UserPayloadDto {
  constructor(user: User) {
    this.token = user.token;
    this.username = user.username;
    this.status = user.status.name;
    this.role = user.role;
  }

  readonly token: string;
  readonly username: string;
  readonly status: string;
  readonly role: UserRoleEnum;
}
