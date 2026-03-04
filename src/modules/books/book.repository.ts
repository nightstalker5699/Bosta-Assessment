import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Book } from '../../generated/prisma/client';
import { paginate } from 'src/common/utils/pagination.util';
import { PaginationQueryDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class BookRepository {
  books: Prisma.BookDelegate;
  constructor(private readonly prisma: PrismaService) {
    this.books = this.prisma.client.book;
  }

  async create(data: Prisma.BookCreateInput) {
    return this.books.create({ data });
  }

  async findAllPaginated(
    query: PaginationQueryDto,
    args?: Prisma.BookFindManyArgs,
  ) {
    return paginate<Book>(this.books, query, args, ['title', 'author', 'isbn']);
  }

  async findById(id: string) {
    return this.books.findUnique({ where: { id } });
  }

  async findOne(query: Prisma.BookFindUniqueArgs) {
    return this.books.findUnique(query);
  }

  async update(
    id: string,
    data: Prisma.BookUpdateInput,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ? tx.book : this.books;
    return client.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.books.delete({ where: { id } });
  }

  async count(query?: Prisma.BookCountArgs) {
    return this.books.count(query);
  }
}
