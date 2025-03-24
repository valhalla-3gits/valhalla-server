import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../../../business-logic/services/auth/auth.service';
import { UserDto } from '../../../core/models/dto/users/user.dto';
import { UserCreateDto } from '../../../core/models/dto/users/userCreate.dto';
import { AuthRequest } from '../../../core/models/dto/users/userPayload.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Get()
  async login(@Req() req: object) {
    if ('user' in req) {
      return await this.authService.login(req.user as UserDto);
    }
    throw new UnauthorizedException('Invalid user');
  }

  @Post('register')
  async registerUser(@Body() user: UserCreateDto) {
    return await this.authService.create(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('renew')
  async renewToken(@Req() req: AuthRequest) {
    const token = await this.authService.renewToken(req.user.token);

    if (!token) {
      throw new UnauthorizedException('Invalid token');
    }

    return token;
  }
}
