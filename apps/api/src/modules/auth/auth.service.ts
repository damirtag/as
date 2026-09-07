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
import { RegisterDto, LoginDto, ITokenPair } from '@as/contracts';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepo: UserRepository,
    private readonly tokensRepo: RefreshTokensRepository,
    private readonly jwt: JwtService,
    private readonly appConfig: AppConfigService,
  ) {}

  async register(dto: RegisterDto) {
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException("Passwords do not match")
    }

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
      tokens,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.usersRepo.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Email already exists');

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Incorrect password');

    const tokens = await this.issueTokens(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt,
      },
      tokens,
    };
  }

  async refreshAccessToken(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }

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

    // Reuse detection: a signature-valid refresh token that we no longer have
    // (or already revoked) was rotated away on a previous use. Seeing it again
    // means it was replayed — assume theft and kill every session for the user.
    if (!stored || stored.revoked) {
      await this.tokensRepo.revokeAllForUser(payload.sub);
      throw new UnauthorizedException('Refresh token reuse detected');
    }

    const user = await this.usersRepo.findById(payload.sub);
    if (!user) throw new UnauthorizedException('User not found');

    // Rotate: revoke the presented token and mint a fresh access/refresh pair.
    await this.tokensRepo.revoke(refreshToken);
    const tokens = await this.issueTokens(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async logout(refreshToken?: string): Promise<void> {
    // Idempotent: clearing the cookie is the source of truth for the client;
    // here we just best-effort revoke the server-side record if it exists.
    if (!refreshToken) return;
    await this.tokensRepo.revoke(refreshToken);
  }

  private async ensureEmailFree(email: string) {
    const exists = await this.usersRepo.exists({ email });
    if (exists) throw new BadRequestException('Email already in use');
  }

  private async issueTokens(user: User): Promise<ITokenPair> {
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

    const result: ITokenPair = { accessToken, refreshToken };

    return result;
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
