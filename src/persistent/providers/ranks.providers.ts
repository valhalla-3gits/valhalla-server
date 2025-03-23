import { RANKS_REPOSITORY } from '../../core/constants';
import { Rank } from '../../core/models/entities/rank.entity';

export const ranksProviders = [
  {
    provide: RANKS_REPOSITORY,
    useValue: Rank,
  },
];
