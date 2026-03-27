import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, LogoutDto } from '@as/contracts';
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
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  refresh(@Body() refreshToken: string) {
    return this.authService.refreshAccessToken(refreshToken);
  }

  @Public()
  @Post('logout')
  logout(@Body() dto: LogoutDto) {
    return this.authService.logout(dto.refreshToken);
  }
}
