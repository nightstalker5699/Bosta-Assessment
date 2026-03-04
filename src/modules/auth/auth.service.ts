import { BadRequestException, Injectable } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { Prisma } from 'src/generated/prisma/client';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login-dto';
import { compareSync } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findOne({
      where: { email: { equals: loginDto.email, mode: 'insensitive' } },
    });

    if (!compareSync(loginDto.password, user.password)) {
      throw new BadRequestException('Invalid password');
    }

    const token = await this.jwtService.signAsync({ id: user.id });
    return { user, token };
  }

  async register(createUserDto: Prisma.UserCreateInput) {
    const user = await this.usersService.create(createUserDto);

    const token = await this.jwtService.signAsync({ id: user.id });

    return { user, token };
  }
}
