import { TESTS_REPOSITORY } from '../../core/constants';
import { Test } from '../../core/models/entities/tests.entity';

export const testsProviders = [
  {
    provide: TESTS_REPOSITORY,
    useValue: Test,
  },
];