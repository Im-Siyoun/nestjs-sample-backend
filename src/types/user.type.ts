import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{8,20}$/;

export class CreateUserDto {
  @ApiProperty({
    example: 'asdflkuvbru',
    description: '아이디를 적어주세요. 아이디는 8글자 이상이여야 합니다.',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: '아이디는 8글자 이상이여야 합니다!' })
  readonly id: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: "1234qwer",
    description: "비밀번호를 적어주세요."
  })
  // @Matches(passwordRegex, {
  //   message: `비밀번호는 8-20자 사이여야 하며,
  //   대소문자,
  //   숫자,
  //   특수문자 하나를 표함하여야 합니다.`,
  // })
  readonly password: string;
}

export type UpdateUserDto = Partial<CreateUserDto>;
