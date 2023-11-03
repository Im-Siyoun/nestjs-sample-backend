import { JwtService } from '@nestjs/jwt';
import { LoginDTO } from 'src/types/auth.type';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../user/entity/user.entity';

export class AuthService {
  constructor(
    private readonly jwtservice: JwtService,
    @Inject(UserService)
    private readonly userservice: UserService,
  ) {}

  createAccessToken(user: User): string {
    const payload = {
      user: user.id,
    };
    const accessToken = this.jwtservice.sign(payload);
    return accessToken;
  }

  async createRefreshToken(user: User): Promise<string> {
    const payload = {
      user: user.id,
    };
    const refreshToken = this.jwtservice.sign(payload, {
      secret: '1234qwer',
      expiresIn: '12h',
    });
    await this.userservice.setCurrentRefreshToken(refreshToken, user.id);
    return refreshToken;
  }

  verifyToken(token: string): any {
    try {
      return this.jwtservice.verify(token);
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  async verifyUser(data: LoginDTO): Promise<User | null> {
    const user = await this.userservice.findUser(data.id);
    if (!user) {
      throw new BadRequestException('아이디가 틀립니다!');
    }
    const isMatched = await bcrypt.compare(data.password, user.password);
    if (isMatched) {
      return user;
    } else {
      throw new BadRequestException('비밀번호가 틀립니다!');
    }
  }

  async refresh(token: string): Promise<string | null> {
    const decodedToken = this.jwtservice.verify(token, { secret: '1234qwer' });
    const userId = decodedToken.user;
    const user = await this.userservice.refreshTokenChecker(
      token,
      userId,
    );
    if (!user) {
      throw new UnauthorizedException(
        '토큰이 변조되었습니다. 다시 로그인 해주세요.',
      );
    }

    const access_token = this.createAccessToken(user);
    return access_token;
  }
}
