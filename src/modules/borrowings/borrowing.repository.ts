import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../../generated/prisma/client.js';
import { paginate } from 'src/common/utils/pagination.util';
import { PaginationQueryDto } from 'src/common/dto/pagination.dto';
import { Borrowing } from './entities/borrowing.entity';

@Injectable()
export class BorrowingRepository {
  borrowings: Prisma.BorrowingDelegate;
  constructor(private readonly prisma: PrismaService) {
    this.borrowings = this.prisma.client.borrowing;
  }

  async create(
    data: Prisma.BorrowingCreateInput,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ? tx.borrowing : this.borrowings;
    return client.create({
      data,
      include: { book: true, user: true },
    });
  }

  async findAllPaginated(
    query: PaginationQueryDto,
    args?: Prisma.BorrowingFindManyArgs,
  ) {
    return paginate<Borrowing>(this.borrowings, query, {
      ...args,
      include: { book: true, user: true },
    });
  }

  async find(args?: Prisma.BorrowingFindManyArgs) {
    return this.borrowings.findMany({
      ...args,
      include: { book: true, user: true },
    });
  }

  async findById(id: string) {
    return this.borrowings.findUnique({
      where: { id },
      include: { book: true, user: true },
    });
  }

  async findOne(query: Prisma.BorrowingFindUniqueArgs) {
    return this.borrowings.findUnique(query);
  }

  async update(
    id: string,
    data: Prisma.BorrowingUpdateInput,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ? tx.borrowing : this.borrowings;
    return client.update({
      where: { id },
      data,
      include: { book: true, user: true },
    });
  }

  async delete(id: string, tx?: Prisma.TransactionClient) {
    const client = tx ? tx.borrowing : this.borrowings;
    return client.delete({ where: { id } });
  }

  async count(query?: Prisma.BorrowingCountArgs) {
    return this.borrowings.count(query);
  }
}
