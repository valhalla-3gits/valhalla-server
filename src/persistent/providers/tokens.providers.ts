import { Token } from '../../core/models/entities/token.entity';

export const tokensProviders = [
  {
    provide: 'TOKENS_REPOSITORY',
    useValue: Token,
  },
];