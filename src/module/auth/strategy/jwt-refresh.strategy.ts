import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { ExtractJwt } from 'passport-jwt';
import { Request } from 'express';
import { UserService } from 'src/module/user/user.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    @Inject(UserService)
    private readonly userservice: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies['refresh-token'];
        },
      ]),
      secretOrkey: '1234qwer',
    });
  }

  async validate(request: Request, payload: any) {
    const token = request?.cookies['refresh-token'];
    const user = await this.userservice.refreshTokenChecker(token, payload.user);
    return user;
  }
}
