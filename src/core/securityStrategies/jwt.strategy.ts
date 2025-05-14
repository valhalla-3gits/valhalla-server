import {
  ExtractJwt,
  Strategy,
  StrategyOptionsWithoutRequest,
} from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../../business-logic/services/users/users.service';
import { TokensService } from '../../business-logic/services/tokens/tokens.service';
import { UserPayloadDto } from '../models/dto/users/userPayload.dto';
import { TokenTypeEnum } from '../models/entities/token.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UsersService,
    private readonly tokensService: TokensService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWTKEY,
    } as StrategyOptionsWithoutRequest);
  }

  async validate(payload: UserPayloadDto) {
    // Extract the token from the request
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()({
      headers: { authorization: `Bearer ${payload.token}` },
    } as any);

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    // Check if the token exists in the database and is not revoked
    const tokenRecord = await this.tokensService.findTokenByValue(token);
    if (!tokenRecord || tokenRecord.type !== TokenTypeEnum.ACCESS) {
      throw new UnauthorizedException(
        'You are not authorized to perform the operation',
      );
    }

    // Check if the user exists and is active
    const user = await this.userService.findOneById(tokenRecord.userId);
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
