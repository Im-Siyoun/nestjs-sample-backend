import { CanActivate, Injectable, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAccessAuthGuard implements CanActivate {
  constructor(private readonly jwtservice: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = await context.switchToHttp().getRequest();
      const access_token = request.cookies['access_token'];
      const user = await this.jwtservice.verify(access_token);
      request.user = user;
      return true;
    } catch (err) {
      return false;
    }
  }
}
