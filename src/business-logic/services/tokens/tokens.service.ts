import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  Token,
  TokenTypeEnum,
} from '../../../core/models/entities/token.entity';
import { User } from '../../../core/models/entities/user.entity';
import { UserPayloadDto } from '../../../core/models/dto/users/userPayload.dto';

@Injectable()
export class TokensService {
  constructor(
    @Inject('TOKENS_REPOSITORY')
    private tokensRepository: typeof Token,
    private readonly jwtService: JwtService,
  ) {}

  async generateAccessToken(
    user: UserPayloadDto,
  ): Promise<{ token: string; expiresAt: Date }> {
    const expiresIn = process.env.ACCESS_TOKEN_EXPIRATION || '15m';
    const expiresAt = new Date();
    expiresAt.setMinutes(
      expiresAt.getMinutes() + parseInt(expiresIn, 10) || 15,
    );

    const token = await this.jwtService.signAsync({ ...user }, { expiresIn });

    return { token, expiresAt };
  }

  async generateRefreshToken(
    user: UserPayloadDto,
  ): Promise<{ token: string; expiresAt: Date }> {
    const expiresIn = process.env.REFRESH_TOKEN_EXPIRATION || '7d';
    const expiresAt = new Date();

    // Parse the expiration time
    if (expiresIn.endsWith('d')) {
      expiresAt.setDate(expiresAt.getDate() + parseInt(expiresIn, 10) || 7);
    } else if (expiresIn.endsWith('h')) {
      expiresAt.setHours(expiresAt.getHours() + parseInt(expiresIn, 10) || 24);
    } else if (expiresIn.endsWith('m')) {
      expiresAt.setMinutes(
        expiresAt.getMinutes() + parseInt(expiresIn, 10) || 60,
      );
    } else {
      // Default to 7 days
      expiresAt.setDate(expiresAt.getDate() + 7);
    }

    const token = await this.jwtService.signAsync({ ...user }, { expiresIn });

    return { token, expiresAt };
  }

  async saveToken(
    userId: number,
    token: string,
    type: TokenTypeEnum,
    expiresAt: Date,
  ): Promise<Token> {
    return this.tokensRepository.create({
      userId,
      token,
      type,
      expiresAt,
    } as Token);
  }

  async findTokenByValue(token: string): Promise<Token | null> {
    return this.tokensRepository.findOne({
      where: {
        token,
        revoked: false,
      },
    });
  }

  async revokeToken(token: string): Promise<boolean> {
    const tokenRecord = await this.tokensRepository.findOne({
      where: {
        token,
      },
    });

    if (!tokenRecord) {
      return false;
    }

    tokenRecord.revoked = true;
    await tokenRecord.save();
    return true;
  }

  async revokeAllUserTokens(userId: number): Promise<boolean> {
    await this.tokensRepository.update(
      { revoked: true },
      {
        where: {
          userId,
          revoked: false,
        },
      },
    );
    return true;
  }

  async createTokens(
    user: User,
  ): Promise<{ accessToken: string; refreshToken: string; expiresIn: number }> {
    const userPayload = new UserPayloadDto(user);

    // Generate tokens
    const { token: accessToken, expiresAt: accessExpiresAt } =
      await this.generateAccessToken(userPayload);
    const { token: refreshToken, expiresAt: refreshExpiresAt } =
      await this.generateRefreshToken(userPayload);

    // Save tokens to database
    await this.saveToken(
      user.id,
      accessToken,
      TokenTypeEnum.ACCESS,
      accessExpiresAt,
    );
    await this.saveToken(
      user.id,
      refreshToken,
      TokenTypeEnum.REFRESH,
      refreshExpiresAt,
    );

    // Calculate expiration time in seconds
    const expiresIn = Math.floor(
      (accessExpiresAt.getTime() - new Date().getTime()) / 1000,
    );

    return { accessToken, refreshToken, expiresIn };
  }

  async refreshTokens(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  } | null> {
    // Find the refresh token in the database
    const tokenRecord = await this.tokensRepository.findOne({
      where: {
        token: refreshToken,
        type: TokenTypeEnum.REFRESH,
        revoked: false,
      },
      include: [{ model: User }],
    });

    if (!tokenRecord || new Date() > tokenRecord.expiresAt) {
      return null;
    }

    // Revoke the old refresh token
    await this.revokeToken(refreshToken);

    // Create new tokens
    return this.createTokens(tokenRecord.user);
  }
}
