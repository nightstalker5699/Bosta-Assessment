import {
  Controller,
  HttpCode,
  Post,
  Body,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/common/decorators/is-public.decorator';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserAuthResponseDto } from '../users/dto/userResponse.dto';
import type { Response } from 'express';
import { LoginDto } from './dto/login-dto';
import { ZodSerializerDto } from 'nestjs-zod';
import { ApiResponse } from '@nestjs/swagger';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Throttle({ default: { ttl: 60000, limit: 5 } })
  @UseGuards(ThrottlerGuard)
  @ZodSerializerDto(UserAuthResponseDto)
  @Public()
  @HttpCode(200)
  @Post('/login')
  @ApiResponse({ status: 200, type: UserAuthResponseDto })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, token } = await this.authService.login(loginDto);

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    return {
      success: true,
      message: 'user logged in successfully',
      data: { ...user, token },
    };
  }

  @Throttle({ default: { ttl: 60000, limit: 5 } })
  @UseGuards(ThrottlerGuard)
  @ZodSerializerDto(UserAuthResponseDto)
  @Public()
  @HttpCode(201)
  @Post('/register')
  @ApiResponse({ status: 201, type: UserAuthResponseDto })
  async register(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, token } = await this.authService.register(createUserDto);

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    return {
      success: true,
      message: 'user registered successfully',
      data: { ...user, token },
    };
  }
}
