import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../../../business-logic/services/auth/auth.service';
import { UserCreateDto } from '../../../core/models/dto/users/userCreate.dto';
import {
  AuthRequest,
  UserPayloadDto,
} from '../../../core/models/dto/users/userPayload.dto';
import { UserDto } from '../../../core/models/dto/users/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @HttpCode(HttpStatus.OK)
  @Post()
  async login(@Req() req: AuthRequest): Promise<{
    user: UserPayloadDto;
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }> {
    return await this.authService.login(req.user);
  }

  @Post('register')
  async registerUser(@Body() user: UserCreateDto): Promise<{
    user: UserDto;
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }> {
    return await this.authService.create(user);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() body: { refreshToken: string }) {
    try {
      return await this.authService.renewToken(body.refreshToken);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Body() body: { refreshToken: string }) {
    const success = await this.authService.logout(body.refreshToken);
    if (!success) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    return { message: 'Logged out successfully' };
  }
}
