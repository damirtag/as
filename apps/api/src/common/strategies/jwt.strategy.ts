import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AppConfigService } from '../../config/app-config.service';
import { UserService } from '../../modules/users/users.service';

export interface JwtPayload {
  sub: string;
  type?: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    appConfig: AppConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: appConfig.jwtSecret,
    });
  }

  async validate(payload: JwtPayload) {
    if (payload.type === 'refresh') {
      throw new UnauthorizedException(
        'Refresh token cannot be used as access token',
      );
    }

    const user = await this.userService.findByIdOrFail(payload.sub);
    return user; // attached to req.user
  }
}
