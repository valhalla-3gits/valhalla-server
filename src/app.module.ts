import { Module } from '@nestjs/common';
import { UsersController } from './api/controllers/users/users.controller';
import { AuthController } from './api/controllers/auth/auth.controller';
import { TasksController } from './api/controllers/tasks/tasks.controller';
import { tasksProviders } from './persistent/providers/tasks.providers';
import { usersProviders } from './persistent/providers/users.providers';
import { tokensProviders } from './persistent/providers/tokens.providers';
import { UsersService } from './business-logic/services/users/users.service';
import { TasksService } from './business-logic/services/tasks/tasks.service';
import { AuthService } from './business-logic/services/auth/auth.service';
import { TokensService } from './business-logic/services/tokens/tokens.service';
import { languagesProviders } from './persistent/providers/languages.providers';
import { ranksProviders } from './persistent/providers/ranks.providers';
import { solvedTasksProviders } from './persistent/providers/solvedTasks.providers';
import { userStatusesProviders } from './persistent/providers/userStatuses.providers';
import { favouriteTasksProviders } from './persistent/providers/favouriteTasks.providers';
import { testsProviders } from './persistent/providers/tests.providers';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { DatabaseModule } from './core/database/database.module';
import { LocalStrategy } from './core/securityStrategies/local.strategy';
import { JwtStrategy } from './core/securityStrategies/jwt.strategy';
import { MetaController } from './api/controllers/meta/meta.controller';
import { RanksService } from './business-logic/services/ranks/ranks.service';
import { LanguagesService } from './business-logic/services/languages/languages.service';
import { TestsService } from './business-logic/services/tests/tests.service';
import { RceEngineService } from './business-logic/services/rce-engine/rce-engine.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWTKEY || 'your-secret-key',
      signOptions: { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION || '15m' },
    }),
    DatabaseModule,
  ],
  controllers: [
    UsersController,
    AuthController,
    TasksController,
    MetaController,
  ],
  providers: [
    ...usersProviders,
    ...tasksProviders,
    ...languagesProviders,
    ...ranksProviders,
    ...solvedTasksProviders,
    ...userStatusesProviders,
    ...favouriteTasksProviders,
    ...testsProviders,
    ...tokensProviders,
    UsersService,
    TasksService,
    AuthService,
    TokensService,
    LocalStrategy,
    JwtStrategy,
    RanksService,
    LanguagesService,
    TestsService,
    RceEngineService,
    // {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard,
    // },
  ],
})
export class AppModule {}
