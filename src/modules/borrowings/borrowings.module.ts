import { Module } from '@nestjs/common';
import { BorrowingsService } from './borrowings.service';
import { BorrowingsController } from './borrowings.controller';
import { BorrowingRepository } from './borrowing.repository';
import { BooksModule } from '../books/books.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [BooksModule, UsersModule],
  controllers: [BorrowingsController],
  providers: [BorrowingsService, BorrowingRepository],
  exports: [BorrowingsService],
})
export class BorrowingsModule {}
