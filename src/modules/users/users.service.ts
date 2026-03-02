import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { Prisma } from '../../generated/prisma/client';
import { hashSync } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}
  async create(createUserDto: Prisma.UserCreateInput) {
    //check for email already in database
    const emailExists = await this.userRepository.count({
      where: { email: createUserDto.email },
    });
    // if exists return error to user
    if (emailExists) {
      throw new BadRequestException('Email already exists');
    }
    //hash password
    createUserDto.password = hashSync(createUserDto.password, 10);
    //create user
    return this.userRepository.create(createUserDto);
  }

  findAll(query?: Prisma.UserFindManyArgs) {
    return this.userRepository.findAll(query);
  }

  async findOne(query: Prisma.UserFindUniqueArgs) {
    //find user by id
    const user = await this.userRepository.findOne(query);
    // if not found return error to user
    if (!user) {
      throw new Error('User not found');
    }
    // return user
    return user;
  }

  async update(id: string, updateUserDto: Prisma.UserUpdateInput) {
    //find user by id
    const user = await this.findOne({ where: { id } });

    //check for email already in database
    if (updateUserDto.email && typeof updateUserDto.email === 'string') {
      const emailExists = await this.userRepository.count({
        where: { email: updateUserDto.email },
      });
      if (emailExists) {
        throw new BadRequestException('Email already exists');
      }
    }

    //hash password
    if (updateUserDto.password && typeof updateUserDto.password === 'string') {
      updateUserDto.password = hashSync(updateUserDto.password, 10);
    }

    //update user
    const updatedUser = await this.userRepository.update(id, updateUserDto);

    return updatedUser;
  }

  async remove(id: string) {
    //find user by id
    const user = await this.findOne({ where: { id } });
    //delete user
    return this.userRepository.delete(id);
  }
}
