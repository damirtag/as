import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto, LoginDto, AuthResponseDto, User } from '@as/contracts';
import { UserRepository } from '../users/users.repository';
import { RefreshTokensRepository } from './refresh-tokens.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepo: UserRepository,
    private readonly tokensRepo: RefreshTokensRepository,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    const exists = await this.usersRepo.exists({ email: dto.email });
    if (exists) throw new BadRequestException('Email already exists');

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.usersRepo.create({
      email: dto.email,
      username: dto.username,
      passwordHash,
    });

    return this.issueTokens(user);
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.usersRepo.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    return this.issueTokens(user);
  }

  private async issueTokens(user: User): Promise<AuthResponseDto> {
    const accessToken = await this.jwt.signAsync(
      { sub: user.id },
      { expiresIn: '15m' },
    );

    const refreshToken = await this.jwt.signAsync(
      { sub: user.id, type: 'refresh' },
      { expiresIn: '30d' },
    );

    await this.tokensRepo.create({
      token: refreshToken,
      type: 'refresh',
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      revoked: false,
      user,
    });

    return { accessToken, refreshToken };
  }
}
