import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDTO {
  @ApiProperty({
    example: 'asdfjh138h',
    description: '아이디를 적어주세요.',
  })
  @IsNotEmpty()
  @IsString()
  readonly id: string;

  @ApiProperty({
    example: '1q2w3e4r',
    description: '비밀번호를 적어주세요.',
  })
  @IsNotEmpty()
  @IsString()
  readonly password: string;
}

export class RefreshTokenDto {
  @ApiProperty({
    example: 'refresh_token',
    description: '토큰 재발급을 위해 refresh_token을 body에 담아 보내주세요.',
  })
  @IsNotEmpty()
  refresh_token: string;
}
