import {
  Controller,
  Get,
  Put,
  Delete,
  UseGuards,
  Param,
  Req,
  ParseUUIDPipe,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '../../../business-logic/services/users/users.service';
import { UserClientModel } from '../../../core/models/viewModels/users/userClient.model';
import { Roles } from '../../../core/guards/roles/role.decorator';
import { RolesGuard } from '../../../core/guards/roles/role.guard';
import { User, UserRoleEnum } from '../../../core/models/entities/user.entity';
import { UserCreateDto } from '../../../core/models/dto/users/userCreate.dto';
import { UserUpdateDto } from '../../../core/models/dto/users/userUpdate.dto';
import { UserStatsDto } from '../../../core/models/dto/users/UserStatsDto';
import { UserPayloadDto } from '../../../core/models/dto/users/userPayload.dto';
import { AuthRequest } from '../../../core/models/types/authRequest';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getCurrentUser(@Req() req: AuthRequest): Promise<UserClientModel> {
    const user: User | null = await this.usersService.findOneByToken(
      req.user.token,
    );
    if (!user) {
      throw new NotFoundException('User not found!');
    }

    const userClientModel = new UserClientModel(user);
    return userClientModel;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('stats')
  async getCurrentUserStats(@Req() req: AuthRequest): Promise<UserStatsDto> {
    const user: User | null = await this.usersService.findOneByToken(
      req.user.token,
    );
    if (!user) {
      throw new NotFoundException('User not found!');
    }

    const userStats = await this.usersService.getStats(user);

    return userStats;
  }

  @UseGuards(AuthGuard('jwt'))
  @Put()
  async updateCurrentUser(
    @Body() userUpdate: UserCreateDto,
    @Req() req: AuthRequest,
  ): Promise<UserClientModel> {
    const user: User | null = await this.usersService.findOneByToken(
      req.user.token,
    );
    if (!user) {
      throw new NotFoundException('User not found!');
    }

    await this.usersService.update(req.user.token, userUpdate);

    await user.reload();

    const userClientModel = new UserClientModel(user);
    return userClientModel;
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('remove')
  async deleteCurrentUser(@Req() req: AuthRequest): Promise<void> {
    const user: User | null = await this.usersService.findOneByToken(
      req.user.token,
    );
    if (!user) {
      throw new NotFoundException('User not found!');
    }

    await this.usersService.delete(req.user.token);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete()
  async disableCurrentUser(@Req() req: AuthRequest): Promise<void> {
    const user: User | null = await this.usersService.findOneByToken(
      req.user.token,
    );
    if (!user) {
      throw new NotFoundException('User not found!');
    }

    await this.usersService.disable(req.user.token);
  }

  @Roles(UserRoleEnum.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get(':token')
  async getUser(@Param('token', ParseUUIDPipe) token: string): Promise<User> {
    const user: User | null = await this.usersService.findOneByToken(token);
    if (!user) {
      throw new NotFoundException('User not found!');
    }

    return user;
  }

  @Roles(UserRoleEnum.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Put(':token')
  async updateUser(
    @Param('token', ParseUUIDPipe) token: string,
    @Body() userUpdate: UserUpdateDto,
  ): Promise<User> {
    const user: User | null = await this.usersService.findOneByToken(token);
    if (!user) {
      throw new NotFoundException('User not found!');
    }

    await this.usersService.updateFull(token, userUpdate);

    await user.reload();

    return user;
  }

  @Roles(UserRoleEnum.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(':token')
  async deleteUser(
    @Param('token', ParseUUIDPipe) token: string,
  ): Promise<void> {
    const user: User | null = await this.usersService.findOneByToken(token);
    if (!user) {
      throw new NotFoundException('User not found!');
    }

    await this.usersService.delete(token);
  }
}
