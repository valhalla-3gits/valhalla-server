import { Injectable, Inject } from '@nestjs/common';
import { User } from '../../../core/models/entities/user.entity';
import { USER_REPOSITORY } from '../../../core/constants';
import { UserCreateDto } from '../../../core/models/dto/users/userCreate.dto';
import { v4 as uuidv4 } from 'uuid';
import { UserDto } from '../../../core/models/dto/users/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: typeof User,
  ) {}

  async create(userCreateDto: UserCreateDto): Promise<User> {
    const user = await this.userRepository.create<User>(
      {
        token: uuidv4(),
        username: userCreateDto.username,
        password: userCreateDto.password,
        firstname: userCreateDto.firstname,
        lastname: userCreateDto.lastname,
      } as User,
      { include: { all: true } },
    );
    return user;
  }

  async update(token: string, userCreateDto: UserCreateDto): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...user } = userCreateDto;
    await this.userRepository.update<User>(
      { ...user },
      {
        where: {
          token: token,
        },
      },
    );
  }

  async updateFull(token: string, userDto: UserDto): Promise<void> {
    await this.userRepository.update<User>(
      { ...userDto },
      {
        where: {
          token: token,
        },
      },
    );
  }

  async delete(token: string): Promise<void> {
    await this.userRepository.update<User>(
      { statusId: 1 },
      {
        where: {
          token: token,
        },
      },
    );
  }

  async findOneByUsername(username: string): Promise<User | null> {
    return await this.userRepository.findOne<User>({
      where: { username },
      include: { all: true },
    });
  }

  async findOneByToken(token: string): Promise<User | null> {
    return await this.userRepository.findOne<User>({
      where: { token },
      include: { all: true },
    });
  }

  async findOneById(id: number): Promise<User | null> {
    return await this.userRepository.findOne<User>({
      where: { id },
      include: { all: true },
    });
  }
}
