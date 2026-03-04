import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BorrowingRepository } from './borrowing.repository';
import { BookRepository } from '../books/book.repository';
import { UserRepository } from '../users/user.repository';
import { BorrowingQueryDto } from './dto/borrowing.dto';
import { Status, Prisma } from '../../generated/prisma/client.js';

import { PrismaService } from '../prisma/prisma.service';
import { BorrowingFindManyArgs } from 'src/generated/prisma/models';

@Injectable()
export class BorrowingsService {
  constructor(
    private readonly borrowingRepository: BorrowingRepository,
    private readonly bookRepository: BookRepository,
    private readonly userRepository: UserRepository,
    private readonly prisma: PrismaService,
  ) {}

  async borrowBook(userId: string, bookId: string) {
    // 1. Check if user exists
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    // 2. Check if book exists and is available
    const book = await this.bookRepository.findById(bookId);
    if (!book) throw new NotFoundException('Book not found');
    if (book.availableQuantity <= 0) {
      throw new BadRequestException('Book is currently not available');
    }

    // 3. Check if user already has this book borrowed and not returned
    const activeBorrowing = await this.borrowingRepository.count({
      where: { userId, bookId, status: Status.BORROWED },
    });
    if (activeBorrowing > 0) {
      throw new BadRequestException(
        'this User already have this book borrowed',
      );
    }

    // 4. Create borrowing in a transaction
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14); // 2 weeks duration

    return this.prisma.client.$transaction(async (tx) => {
      // Decrement available quantity
      await this.bookRepository.update(
        bookId,
        { availableQuantity: { decrement: 1 } },
        tx,
      );

      // Create borrowing record
      return this.borrowingRepository.create(
        {
          user: { connect: { id: userId } },
          book: { connect: { id: bookId } },
          status: Status.BORROWED,
          dueDate,
        },
        tx,
      );
    });
  }

  async returnBook(id: string) {
    const borrowing = await this.borrowingRepository.findById(id);
    if (!borrowing) throw new NotFoundException('Borrowing record not found');
    if (borrowing.status === Status.RETURNED) {
      throw new BadRequestException('Book has already been returned');
    }

    return this.prisma.client.$transaction(async (tx) => {
      // Increment available quantity
      await this.bookRepository.update(
        borrowing.bookId,
        { availableQuantity: { increment: 1 } },
        tx,
      );

      // Update borrowing record
      return this.borrowingRepository.update(
        id,
        {
          status: Status.RETURNED,
          returnDate: new Date(),
        },
        tx,
      );
    });
  }

  async findAll(query: BorrowingQueryDto, userId?: string) {
    const where: Prisma.BorrowingWhereInput = {};
    if (userId) {
      where.userId = userId;
    }

    if (query.status) {
      where.status = query.status as Status;
    }

    if (query.overdue !== undefined) {
      where.status = Status.BORROWED;
      if (query.overdue) {
        where.dueDate = { lt: new Date() };
      } else {
        where.dueDate = { gte: new Date() };
      }
    }

    return this.borrowingRepository.findAllPaginated(query, {
      where,
    });
  }

  async findAllForReport(query: BorrowingFindManyArgs) {
    return this.borrowingRepository.find(query);
  }

  async findOne(id: string) {
    const borrowing = await this.borrowingRepository.findById(id);
    if (!borrowing) throw new NotFoundException('Borrowing record not found');
    return borrowing;
  }

  async remove(id: string) {
    const borrowing = await this.findOne(id);

    return this.prisma.client.$transaction(async (tx) => {
      // If it was borrowed and not returned, increment count before deleting
      if (borrowing.status === Status.BORROWED) {
        await this.bookRepository.update(
          borrowing.bookId,
          { availableQuantity: { increment: 1 } },
          tx,
        );
      }

      return this.borrowingRepository.delete(id, tx);
    });
  }
}
