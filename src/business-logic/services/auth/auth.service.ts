/* eslint-disable @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unused-vars,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-return */
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../../../core/models/entities/user.entity';
import { UserDto } from '../../../core/models/dto/users/user.dto';
import { UserPayloadDto } from '../../../core/models/dto/users/userPayload.dto';
import { UserCreateDto } from '../../../core/models/dto/users/userCreate.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<UserDto | null> {
    const user: User | null =
      await this.userService.findOneByUsername(username);
    if (!user) {
      return null;
    }

    const match = await this.comparePassword(pass, user.password);
    if (!match) {
      return null;
    }

    const { password, ...result } = user['dataValues'];
    return result as UserDto;
  }

  public async login(user: UserDto) {
    const token = await this.generateToken(user);
    return { user, token };
  }

  public async create(
    user: UserCreateDto,
  ): Promise<{ user: UserDto; token: string }> {
    const pass: string = await this.hashPassword(user.password);

    const newUser: User = await this.userService.create({
      ...user,
      password: pass,
    });

    const { password, ...result } = newUser['dataValues'];

    const token = await this.generateToken(result as UserDto);

    return { user: result as UserDto, token };
  }

  public async renewToken(userToken: string) {
    const user = await this.userService.findOneByToken(userToken);

    if (!user) {
      return null;
    }

    const token = await this.generateToken(user as UserDto);

    return { token: token };
  }

  private async generateToken(user: UserDto) {
    const payload = new UserPayloadDto(user);
    const token = await this.jwtService.signAsync(payload);
    return token;
  }

  private async hashPassword(password) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }

  private async comparePassword(enteredPassword, dbPassword) {
    const match = await bcrypt.compare(enteredPassword, dbPassword);
    return match;
  }
}
