import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { TokensService } from '../tokens/tokens.service';
import { User } from '../../../core/models/entities/user.entity';
import { UserDto } from '../../../core/models/dto/users/user.dto';
import { UserPayloadDto } from '../../../core/models/dto/users/userPayload.dto';
import { UserCreateDto } from '../../../core/models/dto/users/userCreate.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly tokensService: TokensService,
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
    const userEntity = await this.userService.findOneByUsername(user.username);
    if (!userEntity) {
      throw new NotFoundException('User not found');
    }

    const tokens = await this.tokensService.createTokens(userEntity);
    return {
      user,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: tokens.expiresIn,
    };
  }

  public async create(
    user: UserCreateDto,
  ): Promise<{
    user: UserDto;
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }> {
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

    // Create tokens
    const tokens = await this.tokensService.createTokens(newUser);

    // Create a proper UserDto instance
    const userDto = new UserDto(newUser);

    return {
      user: userDto,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: tokens.expiresIn,
    };
  }

  public async renewToken(refreshToken: string) {
    const tokens = await this.tokensService.refreshTokens(refreshToken);

    if (!tokens) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return tokens;
  }

  public async logout(refreshToken: string): Promise<boolean> {
    return this.tokensService.revokeToken(refreshToken);
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
