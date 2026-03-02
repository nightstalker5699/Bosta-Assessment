import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { APP_GUARD } from '@nestjs/core';
import { authGuard } from './guards/auth.guard';

import { JwtModule } from '@nestjs/jwt';

import { roleGuard } from './guards/role.guard';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,

      useClass: authGuard,
    },
    {
      provide: APP_GUARD,
      useClass: roleGuard,
    },
  ],
  imports: [
    UsersModule,
    JwtModule.register({
      // register this module as a global module
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '30d',
      },
    }),
  ],
})
export class AuthModule {}
