import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async validateUser(username: string, pass: string): Promise<User | null> {
    const user: User | null =
      await this.userService.findOneByUsername(username);
    if (!user) {
      return null;
    }

    if (user.statusId == 1) {
      throw new NotFoundException('User not found');
    }

    const match = await this.comparePassword(pass, user.password);
    if (!match) {
      return null;
    }

    // const { password, ...result } = user['dataValues'];
    return user;
  }

  public async login(user: UserPayloadDto) {
    const token = await this.generateToken(user);
    return { user, token };
  }

  public async create(
    user: UserCreateDto,
  ): Promise<{ user: UserDto; token: string }> {
    const userExist = await this.userService.findOneByUsername(user.username);
    if (userExist) {
      throw new ForbiddenException('This username already exist');
    }

    const pass: string = await this.hashPassword(user.password);

    const newUser: User = await this.userService.create({
      ...user,
      password: pass,
    });

    await newUser.reload();

    const userPayload = new UserPayloadDto(newUser);
    const token = await this.generateToken(userPayload);

    // Create a proper UserDto instance
    const userDto = new UserDto(newUser);

    return { user: userDto, token };
  }

  public async renewToken(userToken: string) {
    const user = await this.userService.findOneByToken(userToken);

    if (!user) {
      return null;
    }

    const userPayload = new UserPayloadDto(user);
    const token = await this.generateToken(userPayload);

    return { token: token };
  }

  private async generateToken(user: UserPayloadDto) {
    const token = await this.jwtService.signAsync({ ...user });
    return token;
  }

  private async hashPassword(password: string) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }

  private async comparePassword(enteredPassword: string, dbPassword: string) {
    const match = await bcrypt.compare(enteredPassword, dbPassword);
    return match;
  }
}
