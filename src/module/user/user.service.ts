import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { User } from './entity/user.entity';
import { CreateUserDto, UpdateUserDto } from '../../types/user.type';
import * as bcrypt from 'bcrypt';

export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  createUser(data: CreateUserDto): Promise<User> {
    const user: User = new User();
    user.id = data.id;
    user.password = data.password;

    return this.userRepository.save(user);
  }

  findUser(data: string): Promise<User> {
    return this.userRepository.findOneBy({ id: data });
  }

  findAllUser(): Promise<User[]> {
    return this.userRepository.find();
  }

  deleteUser(data: string): Promise<DeleteResult> {
    return this.userRepository.delete({ id: data });
  }

  updateUser(id: string, data: UpdateUserDto): Promise<UpdateResult> {
    return this.userRepository.update({ id: id }, data);
  }

  async refreshTokenChecker(token: string, id: string): Promise<User | null> {
    const user = await this.findUser(id);
    if (!user.currentRefreshToken) {
      return null;
    }
    const isTokenMatched = user.currentRefreshToken == token;

    if (isTokenMatched) {
      return user;
    }
  }

  async setCurrentRefreshToken(token: string, id: string): Promise<any> {
    await this.userRepository.update(
      { id: id },
      { currentRefreshToken: token },
    );
  }

  async removeRefreshToken(id): Promise<any> {
    await this.userRepository.update({ id: id }, { currentRefreshToken: null });
  }
}
