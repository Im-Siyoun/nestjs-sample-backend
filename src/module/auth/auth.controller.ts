import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { LoginDTO, RefreshTokenDto } from 'src/types/auth.type';
import { ResponseType } from 'src/types/general.type';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { UserService } from '../user/user.service';
import { JwtRefreshGuard } from './guard/jwt-refresh.guard';
import { JwtAccessAuthGuard } from './guard/jwt-access.guard';
import { ApiTags } from '@nestjs/swagger';

@Controller('/auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly authservice: AuthService,
    private readonly userservice: UserService,
  ) {}

  @Post('/login')
  async login(
    @Body() data: LoginDTO,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseType> {
    const user = await this.authservice.verifyUser(data);
    if (user) {
      const accessToken = this.authservice.createAccessToken(user);
      const refreshToken = await this.authservice.createRefreshToken(user);
      res.setHeader('Authorization', 'Bearer ' + accessToken);
      res.cookie('access_token', accessToken);
      res.cookie('refresh_token', refreshToken);
      return {
        message: '로그인에 성공하였습니다.',
      };
    } else {
      throw new UnauthorizedException({
        message: '로그인에 실패하였습니다.',
      });
    }
  }

  @Post('/refresh')
  async refresh(
    @Body() data: RefreshTokenDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseType> {
    try {
      const accessToken = await this.authservice.refresh(data.refresh_token);
      res.setHeader('Authorization', 'Bearer ' + accessToken);
      res.cookie('access_token', accessToken);
      return {
        message: '토큰이 갱신되었습니다.',
      };
    } catch (err) {
      throw new UnauthorizedException(
        '토큰이 변조되었습니다. 다시 로그인 해주세요.',
      );
    }
  }

  @Post('/logout')
  @UseGuards(JwtRefreshGuard)
  async logout(@Req() req: any, @Res() res: any) {
    await this.userservice.removeRefreshToken(req.user.id);
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    return {
      message: '로그아웃 되었습니다.',
    };
  }

  @Get('/login')
  @UseGuards(JwtAccessAuthGuard)
  logincheck(@Req() req: any): ResponseType {
    if (req.user) {
      return {
        message: `로그인 되어 있습니다 ${req.user.user}.`,
      };
    }
    return {
      message: '로그인 되어있지 않습니다.',
    };
  }
}
