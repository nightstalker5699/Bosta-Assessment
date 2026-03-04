import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BookRepository } from './book.repository';
import { Prisma } from '../../generated/prisma/client';
import { PaginationQueryDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class BooksService {
  constructor(private readonly bookRepository: BookRepository) {}

  async create(createBookDto: Prisma.BookCreateInput) {
    const isbnExists = await this.bookRepository.count({
      where: { isbn: createBookDto.isbn },
    });
    if (isbnExists) {
      throw new BadRequestException('Book with this ISBN already exists');
    }
    return this.bookRepository.create(createBookDto);
  }

  async findAllPaginated(query: PaginationQueryDto) {
    return this.bookRepository.findAllPaginated(query);
  }

  async findOne(id: string) {
    const book = await this.bookRepository.findById(id);
    if (!book) {
      throw new NotFoundException('Book not found');
    }
    return book;
  }

  async update(id: string, updateBookDto: Prisma.BookUpdateInput) {
    await this.findOne(id);

    if (updateBookDto.isbn && typeof updateBookDto.isbn === 'string') {
      const isbnExists = await this.bookRepository.count({
        where: { isbn: updateBookDto.isbn, NOT: { id } },
      });
      if (isbnExists) {
        throw new BadRequestException('Book with this ISBN already exists');
      }
    }

    return this.bookRepository.update(id, updateBookDto);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.bookRepository.delete(id);
  }
}
