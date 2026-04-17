import { Controller, Post, Body, Res } from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, LogoutDto, RefreshDto } from '@as/contracts';
import { Public } from '../../common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(dto);

    res.cookie('refreshToken', result.tokens.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30days
    });

    return {
      user: result.user,
      accessToken: result.tokens.accessToken,
    };
  }

  @Public()
  @Post('refresh')
  refresh(@Body() req: Request) {
    const refreshToken = req.cookies.refreshToken;

    return this.authService.refreshAccessToken(refreshToken);
  }

  @Public()
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refreshToken');

    return { success: true };
  }
}
