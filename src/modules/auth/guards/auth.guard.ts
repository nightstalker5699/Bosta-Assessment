import { IS_PUBLIC_KEY } from 'src/common/decorators/is-public.decorator';
import { UserRepository } from 'src/modules/users/user.repository';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class authGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userRepository: UserRepository,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext) {
    //1) check for public url
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getClass(),
      context.getHandler(),
    ]);

    if (isPublic) return true;

    //2) check for token
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);
    if (!token) throw new UnauthorizedException();

    try {
      //3) check for token validation
      const payload = await this.jwtService.verifyAsync(token);
      //4) check for user existence in the database
      const user = await this.userRepository.findById(payload.id);
      if (!user) throw new UnauthorizedException();

      //5) check if password was changed after token issuance
      if (
        this.isPasswordChangedAfterToken(user.passwordChangedAt, payload.iat)
      ) {
        throw new UnauthorizedException();
      }

      //6) all good attach user object to request object
      request['user'] = user;
    } catch (err) {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractToken(request: Request): string | undefined {
    // Priority 1: Authorization Header
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (type === 'Bearer' && token) return token;

    // Priority 2: Cookie
    if (request.cookies && request.cookies.token) {
      return request.cookies.token;
    }

    return undefined;
  }

  private isPasswordChangedAfterToken(
    passwordChangedAt,
    tokenIssuedAt: number,
  ): boolean {
    if (!passwordChangedAt) return false;

    // Get UTC timestamps
    const passwordChangedTimestamp = new Date(passwordChangedAt).getTime();
    const tokenIssuedTimestamp = tokenIssuedAt * 1000;

    // Optional: Add a small grace period (e.g., 1 second) to handle clock skew
    const gracePeriod = 1000; // 1 second in milliseconds

    return passwordChangedTimestamp > tokenIssuedTimestamp + gracePeriod;
  }
}
