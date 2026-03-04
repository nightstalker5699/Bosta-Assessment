import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role, Roles } from 'src/common/decorators/roles.decorator';
import {
  PaginatedUserResponseDto,
  UserListResponseDto,
  UserResponseDto,
} from './dto/userResponse.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination.dto';
import { ZodSerializerDto } from 'nestjs-zod';
import { ApiResponse } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/currentUser.decorator';
import type { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ZodSerializerDto(UserResponseDto)
  @Roles(Role.ADMIN)
  @Post()
  @ApiResponse({ status: 201, type: UserResponseDto })
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return { message: 'User created successfully', success: true, data: user };
  }

  @ZodSerializerDto(PaginatedUserResponseDto)
  @Roles(Role.ADMIN)
  @Get()
  @ApiResponse({ status: 200, type: PaginatedUserResponseDto })
  async findAll(@Query() query: PaginationQueryDto) {
    const result = await this.usersService.findAllPaginated(query);
    return {
      message: 'Users fetched successfully',
      success: true,
      ...result,
    };
  }

  @ZodSerializerDto(UserResponseDto)
  @Roles(Role.ADMIN, Role.USER)
  @Get('me')
  @ApiResponse({ status: 200, type: UserResponseDto })
  async findMe(@CurrentUser() user: User) {
    return { message: 'User fetched successfully', success: true, data: user };
  }

  @ZodSerializerDto(UserResponseDto)
  @Roles(Role.ADMIN)
  @Get(':id')
  @ApiResponse({ status: 200, type: UserResponseDto })
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne({ where: { id } });
    return { message: 'User fetched successfully', success: true, data: user };
  }
  @ZodSerializerDto(UserResponseDto)
  @ApiResponse({ status: 200, type: UserResponseDto })
  @Patch('me')
  async updateMe(
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: User,
  ) {
    const updatedUser = await this.usersService.update(user.id, updateUserDto);
    return {
      message: 'User updated successfully',
      success: true,
      data: updatedUser,
    };
  }

  @ZodSerializerDto(UserResponseDto)
  @Roles(Role.ADMIN)
  @Patch(':id')
  @ApiResponse({ status: 200, type: UserResponseDto })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.usersService.update(id, updateUserDto);
    return { message: 'User updated successfully', success: true, data: user };
  }

  @ZodSerializerDto(UserResponseDto)
  @Roles(Role.ADMIN)
  @Delete(':id')
  @ApiResponse({ status: 200, type: UserResponseDto })
  async remove(@Param('id') id: string) {
    const user = await this.usersService.remove(id);
    return { message: 'User deleted successfully', success: true, data: user };
  }
}
