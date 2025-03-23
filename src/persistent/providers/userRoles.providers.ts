import { UserRole } from '../../core/models/entities/userRole.entity';
import { USER_ROLES_REPOSITORY } from '../../core/constants';

export const userRolesProviders = [
  {
    provide: USER_ROLES_REPOSITORY,
    useValue: UserRole,
  },
];
