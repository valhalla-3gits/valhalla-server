import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { RANKS_REPOSITORY } from '../../../core/constants';
import { Rank } from '../../../core/models/entities/rank.entity';

@Injectable()
export class RanksService {
  constructor(
    @Inject(RANKS_REPOSITORY) private readonly ranksRepository: typeof Rank,
  ) {}

  async getRankById(rank_id: string) {
    const rank = await this.ranksRepository.findOne({
      where: {
        id: rank_id,
      },
    });

    if (!rank) {
      throw new NotFoundException('Rank not found');
    }

    return rank;
  }

  async getRanks(): Promise<Rank[] | null> {
    let ranks = await this.ranksRepository.findAll<Rank>();
    if (ranks.length === 0) {
      throw new NotFoundException('No ranks found');
    }
    ranks = ranks.sort((a: Rank, b: Rank) => a.number - b.number);
    return ranks;
  }

  async getRankByToken(rank_uuid: string): Promise<Rank> {
    const rank = await this.ranksRepository.findOne({
      where: {
        token: rank_uuid,
      },
    });

    if (!rank) {
      throw new NotFoundException('Rank not found');
    }

    return rank;
  }
}
