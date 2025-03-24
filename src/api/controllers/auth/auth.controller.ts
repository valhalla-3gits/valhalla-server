import {
  Body,
  Controller,
  Get,
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

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @HttpCode(HttpStatus.OK)
  @Post()
  async login(
    @Req() req: AuthRequest,
  ): Promise<{ user: UserPayloadDto; token: string }> {
    return await this.authService.login(req.user);
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
