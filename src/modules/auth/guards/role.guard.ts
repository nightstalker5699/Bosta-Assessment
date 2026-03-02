import { ROLES_KEY } from 'src/common/decorators/roles.decorator';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class roleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext) {
    //1) check for public url
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getClass(), context.getHandler()],
    );

    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!requiredRoles.some((role) => user.role == role))
      throw new UnauthorizedException("you can't access this endpoint");
    return true;
  }
}
