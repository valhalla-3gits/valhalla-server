import { Injectable, Inject } from '@nestjs/common';
import { User } from '../../../core/models/entities/user.entity';
import { RANKS_REPOSITORY, USER_REPOSITORY } from '../../../core/constants';
import { UserCreateDto } from '../../../core/models/dto/users/userCreate.dto';
import { v4 as uuidv4 } from 'uuid';
import { UserDto } from '../../../core/models/dto/users/user.dto';
import { UserUpdateDto } from '../../../core/models/dto/users/userUpdate.dto';
import { Rank } from '../../../core/models/entities/rank.entity';
import { Op } from 'sequelize';
import { UserStatsDto } from '../../../core/models/dto/users/UserStatsDto';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: typeof User,
    @Inject(RANKS_REPOSITORY) private readonly ranksRepository: typeof Rank,
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

  async updateFull(token: string, userDto: UserUpdateDto): Promise<void> {
    await this.userRepository.update<User>(
      {
        firstname: userDto.firstname,
        lastname: userDto.lastname,
      } as User,
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

  async promoteRank(user: User) {
    const ranks = await this.ranksRepository.findAll({
      where: {
        number: {
          [Op.gt]: user.rank.number,
        },
      },
    });
    const sorted_rank = ranks.sort((a, b) => a.value - b.value);

    const new_rank = sorted_rank[0];

    user.rankId = new_rank.id;
    await user.save();
  }

  async getStats(user: User): Promise<UserStatsDto> {
    const nextRank = await this.ranksRepository.findOne({
      where: {
        number: user.rank.number + 1,
      },
    });

    const userStats = {
      tasksCompleted: user.solvedTasks?.length ?? 0,
      currentXp: user.experience,
      xpToNextRank: user.rank.targetValue - user.experience,
      nextRank: nextRank?.name ?? 'N/A',
    } as UserStatsDto;

    return userStats;
  }
}
