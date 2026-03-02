import { Controller, HttpCode, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/common/decorators/is-public.decorator';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserResponseDto } from '../users/dto/userResponse.dto';
import type { Response } from 'express';
import { LoginDto } from './dto/login-dto';
import { ZodSerializerDto } from 'nestjs-zod';
import { ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ZodSerializerDto(UserResponseDto)
  @Public()
  @HttpCode(200)
  @Post('/login')
  @ApiResponse({ status: 200, type: UserResponseDto })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, token } = await this.authService.login(loginDto);

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
    });
    return {
      success: true,
      message: 'user logged in successfully',
      data: user,
    };
  }

  @ZodSerializerDto(UserResponseDto)
  @Public()
  @HttpCode(201)
  @Post('/register')
  @ApiResponse({ status: 201, type: UserResponseDto })
  async register(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, token } = await this.authService.register(createUserDto);

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
    });
    return {
      success: true,
      message: 'user registered successfully',
      data: user,
    };
  }
}
