import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../../business-logic/services/auth/auth.service';
import { User } from '../models/entities/user.entity';
import { UserPayloadDto } from '../models/dto/users/userPayload.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<UserPayloadDto> {
    const user: User | null = await this.authService.validateUser(
      username,
      password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid user credentials');
    }
    return new UserPayloadDto(user);
  }
}
