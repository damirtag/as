import { Controller, Post, Body, Res, Req } from '@nestjs/common';
import type { Response, Request, CookieOptions } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from '@as/contracts';
import { Public } from '../../common/decorators/public.decorator';
import { RateLimit } from '../../common/decorators/rate-limit.decorator';

const REFRESH_COOKIE = 'refreshToken';

// Scoped to /auth so the refresh token is never sent to the GraphQL endpoint.
const REFRESH_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: 'lax',
  path: '/auth',
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
};

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.register(dto);

    res.cookie(REFRESH_COOKIE, result.tokens.refreshToken, REFRESH_COOKIE_OPTIONS);

    return {
      user: result.user,
      accessToken: result.tokens.accessToken,
    };
  }

  @Public()
  // Note: Rate limiting for now is not applied to the login endpoint, 
  // but it can be enabled if needed.
  // @RateLimit({
  //   key: ({ ip }) => `rate-limit:auth:login:${ip}`,
  //   limit: 5,
  //   windowSec: 60,
  // })
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(dto);

    res.cookie(REFRESH_COOKIE, result.tokens.refreshToken, REFRESH_COOKIE_OPTIONS);

    return {
      user: result.user,
      accessToken: result.tokens.accessToken,
    };
  }

  @Public()
  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.[REFRESH_COOKIE];
    const result = await this.authService.refreshAccessToken(refreshToken);

    // Rotation: replace the cookie with the freshly issued refresh token.
    res.cookie(REFRESH_COOKIE, result.refreshToken, REFRESH_COOKIE_OPTIONS);

    return {
      user: result.user,
      accessToken: result.accessToken,
    };
  }

  @Public()
  @Post('logout')
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.[REFRESH_COOKIE];
    await this.authService.logout(refreshToken);

    res.clearCookie(REFRESH_COOKIE, { path: REFRESH_COOKIE_OPTIONS.path });

    return { success: true };
  }
}
