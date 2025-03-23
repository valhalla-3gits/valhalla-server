import { UserStatus } from '../../core/models/entities/userStatus.entity';
import { USER_STATUSES_REPOSITORY } from '../../core/constants';

export const userStatusesProviders = [
  {
    provide: USER_STATUSES_REPOSITORY,
    useValue: UserStatus,
  },
];
