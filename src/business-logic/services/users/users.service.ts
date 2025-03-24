import { Injectable, Inject } from '@nestjs/common';
import { User } from '../../../core/models/entities/user.entity';
import { USER_REPOSITORY } from '../../../core/constants';
import { UserCreateDto } from '../../../core/models/dto/users/userCreate.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: typeof User,
  ) {}

  async create(userCreateDto: UserCreateDto): Promise<User> {
    return await this.userRepository.create<User>(userCreateDto as User);
  }

  async findOneByUsername(username: string): Promise<User | null> {
    return await this.userRepository.findOne<User>({ where: { username } });
  }

  async findOneByToken(token: string): Promise<User | null> {
    return await this.userRepository.findOne<User>({ where: { token } });
  }

  async findOneById(id: number): Promise<User | null> {
    return await this.userRepository.findOne<User>({ where: { id } });
  }
}
