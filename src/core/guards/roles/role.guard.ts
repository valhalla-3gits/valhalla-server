import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './role.decorator';
import { UserPayloadDto } from '../../models/dto/users/userPayload.dto';
import { UserRoleEnum } from '../../models/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRoleEnum[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }
    const req: Request & { user: UserPayloadDto } = context
      .switchToHttp()
      .getRequest();
    return requiredRoles.some((role) => req.user.role == role);
  }
}
