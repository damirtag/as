import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, type JwtSignOptions } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '@as/contracts';
import { RefreshTokensRepository } from './refresh-tokens.repository';
import { UserRepository } from '../users/users.repository';
import { AppConfigService } from '../../config/app-config.service';
import { RegisterDto, LoginDto } from '@as/contracts';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepo: UserRepository,
    private readonly tokensRepo: RefreshTokensRepository,
    private readonly jwt: JwtService,
    private readonly appConfig: AppConfigService,
  ) {}

  async register(dto: RegisterDto) {
    await this.ensureEmailFree(dto.email);
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.usersRepo.create({ ...dto, passwordHash });

    const tokens = await this.issueTokens(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt,
      },
      ...tokens,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.usersRepo.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const tokens = await this.issueTokens(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt,
      },
      ...tokens,
    };
  }

  async refreshAccessToken(refreshToken: string) {
    let payload: { sub: string; type: string };
    try {
      payload = await this.jwt.verifyAsync(refreshToken, {
        secret: this.appConfig.jwtSecret,
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('Provided token is not a refresh token');
    }

    const stored = await this.tokensRepo.findOne({ token: refreshToken });
    if (!stored || stored.revoked) {
      throw new UnauthorizedException('Refresh token revoked or not found');
    }

    const user = await this.usersRepo.findById(payload.sub);
    if (!user) throw new UnauthorizedException('User not found');

    const accessToken = await this.jwt.signAsync(
      { sub: user.id },
      { expiresIn: this.appConfig.jwtAccessTtl as JwtSignOptions['expiresIn'] },
    );

    return { accessToken };
  }

  async logout(refreshToken: string): Promise<void> {
    const token = await this.tokensRepo.findOne({ token: refreshToken });
    if (!token) throw new UnauthorizedException('Invalid refresh token');
    await this.tokensRepo.revoke(token.id);
  }

  private async ensureEmailFree(email: string) {
    const exists = await this.usersRepo.exists({ email });
    if (exists) throw new BadRequestException('Email already in use');
  }

  private async issueTokens(user: User) {
    await this.tokensRepo.revokeAllForUser(user.id);

    const accessToken = await this.jwt.signAsync(
      { sub: user.id },
      { expiresIn: this.appConfig.jwtAccessTtl as JwtSignOptions['expiresIn'] },
    );

    const refreshToken = await this.jwt.signAsync(
      { sub: user.id, type: 'refresh' },
      {
        expiresIn: this.appConfig.jwtRefreshTtl as JwtSignOptions['expiresIn'],
      },
    );

    const expiresAt = this.parseExpiresAt(this.appConfig.jwtRefreshTtl);
    await this.tokensRepo.create({
      token: refreshToken,
      type: 'refresh',
      expiresAt,
      revoked: false,
      user,
    });

    return { accessToken, refreshToken };
  }

  private parseExpiresAt(ttl: string): Date {
    const unit = ttl.slice(-1);
    const value = parseInt(ttl.slice(0, -1), 10);
    const ms =
      unit === 'd'
        ? value * 86400000
        : unit === 'h'
          ? value * 3600000
          : unit === 'm'
            ? value * 60000
            : 0;
    return new Date(Date.now() + ms);
  }
}
