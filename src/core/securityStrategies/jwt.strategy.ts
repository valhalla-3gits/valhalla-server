import {
  ExtractJwt,
  Strategy,
  StrategyOptionsWithoutRequest,
} from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../../business-logic/services/users/users.service';
import { UserPayloadDto } from '../models/dto/users/userPayload.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWTKEY,
    } as StrategyOptionsWithoutRequest);
  }

  async validate(payload: UserPayloadDto) {
    // check if user in the token actually exist
    const user = await this.userService.findOneByToken(payload.token);
    if (!user) {
      throw new UnauthorizedException(
        'You are not authorized to perform the operation',
      );
    }
    if (user.statusId == 1) {
      throw new UnauthorizedException(
        'You are not authorized to perform the operation',
      );
    }
    return new UserPayloadDto(user);
  }
}
