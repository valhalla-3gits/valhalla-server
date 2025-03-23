import { Module } from '@nestjs/common';
import { UsersController } from './api/controllers/users/users.controller';
import { AuthController } from './api/controllers/auth/auth.controller';
import { TasksController } from './api/controllers/tasks/tasks.controller';
import { tasksProviders } from './persistent/providers/tasks.providers';
import { usersProviders } from './persistent/providers/users.providers';
import { UsersService } from './business-logic/services/users/users.service';
import { TasksService } from './business-logic/services/tasks/tasks.service';
import { AuthService } from './business-logic/services/auth/auth.service';
import { languagesProviders } from './persistent/providers/languages.providers';
import { ranksProviders } from './persistent/providers/ranks.providers';
import { solvedTasksProviders } from './persistent/providers/solvedTasks.providers';
import { userRolesProviders } from './persistent/providers/userRoles.providers';
import { userStatusesProviders } from './persistent/providers/userStatuses.providers';

@Module({
  imports: [],
  controllers: [UsersController, AuthController, TasksController],
  providers: [
    ...tasksProviders,
    ...usersProviders,
    ...languagesProviders,
    ...ranksProviders,
    ...solvedTasksProviders,
    ...userRolesProviders,
    ...userStatusesProviders,
    UsersService,
    TasksService,
    AuthService,
  ],
})
export class AppModule {}
