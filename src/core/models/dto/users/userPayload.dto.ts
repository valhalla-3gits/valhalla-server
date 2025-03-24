import { UserDto } from './user.dto';
import { Request as HttpRequest } from 'express';

export class UserPayloadDto {
  constructor(user: UserDto) {
    this.token = user.token;
    this.username = user.username;
    this.role = user.role.name;
    this.status = user.status.name;
  }

  readonly token: string;
  readonly username: string;
  readonly role: string;
  readonly status: string;
}

export type AuthRequest = HttpRequest & { user: UserPayloadDto };
