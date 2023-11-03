import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from 'src/types/user.type';
import { ResponseType } from 'src/types/general.type';
import { ApiTags } from '@nestjs/swagger';

@Controller('/user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userservice: UserService) {}

  @Post()
  async create(@Body() data: CreateUserDto): Promise<ResponseType> {
    console.log(data);
    const result = await this.userservice.createUser(data);
    return {
      message: '사용자가 성공적으로 생성되었습니다.',
      content: result,
    };
  }

  @Get('/:id')
  async getOneUser(@Param('id') id: string): Promise<ResponseType> {
    const result = await this.userservice.findUser(id);
    return {
      message: '사용자 조회 결과입니다',
      content: result,
    };
  }

  @Get()
  async getUser(): Promise<ResponseType> {
    const result = await this.userservice.findAllUser();
    return {
      message: '사용자 조회 결과입니다',
      content: result,
    };
  }

  @Patch('/:id')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateUserDto,
  ): Promise<ResponseType> {
    const result = await this.userservice.updateUser(id, data);
    return {
      message: '사용자 정보 수정 결과입니다.',
      content: result,
    };
  }

  @Delete('/:id')
  async deleteUser(@Param('id') id: string): Promise<ResponseType> {
    const result = await this.userservice.deleteUser(id);
    return {
      message: '사용자 삭제 결과입니다.',
      content: result,
    };
  }
}
