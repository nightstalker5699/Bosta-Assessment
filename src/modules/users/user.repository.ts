import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '../../generated/prisma/client';
import { paginate } from 'src/common/utils/pagination.util';
import { PaginationQueryDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class UserRepository {
  users: Prisma.UserDelegate;
  constructor(private readonly prisma: PrismaService) {
    this.users = this.prisma.client.user;
  }

  async create(data: Prisma.UserCreateInput) {
    return this.users.create({ data });
  }

  async findAll(query?: Prisma.UserFindManyArgs) {
    return this.users.findMany(query);
  }

  async findAllPaginated(
    query: PaginationQueryDto,
    args?: Prisma.UserFindManyArgs,
  ) {
    return paginate<User>(this.users, query, args, ['name', 'email']);
  }

  async findById(id: string) {
    return this.users.findUnique({ where: { id } });
  }

  async findOne(query: Prisma.UserFindUniqueArgs) {
    return this.users.findUnique(query);
  }
  async update(id: string, data: Prisma.UserUpdateInput) {
    return this.users.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.users.delete({ where: { id } });
  }
  async count(query?: Prisma.UserCountArgs) {
    return this.users.count(query);
  }
}
