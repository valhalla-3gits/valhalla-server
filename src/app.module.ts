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
import { userStatusesProviders } from './persistent/providers/userStatuses.providers';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { DatabaseModule } from './core/database/database.module';
import { LocalStrategy } from './core/securityStrategies/local.strategy';
import { JwtStrategy } from './core/securityStrategies/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWTKEY,
      signOptions: { expiresIn: process.env.TOKEN_EXPIRATION },
    }),
    DatabaseModule,
  ],
  controllers: [UsersController, AuthController, TasksController],
  providers: [
    ...usersProviders,
    ...tasksProviders,
    ...languagesProviders,
    ...ranksProviders,
    ...solvedTasksProviders,
    ...userStatusesProviders,
    UsersService,
    TasksService,
    AuthService,
    LocalStrategy,
    JwtStrategy,
    // {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard,
    // },
  ],
})
export class AppModule {}
