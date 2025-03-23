import { LANGUAGES_REPOSITORY } from '../../core/constants';
import { Language } from '../../core/models/entities/language.entity';

export const languagesProviders = [
  {
    provide: LANGUAGES_REPOSITORY,
    useValue: Language,
  },
];
