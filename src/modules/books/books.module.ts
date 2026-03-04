import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { BookRepository } from './book.repository';

@Module({
  controllers: [BooksController],
  providers: [BooksService, BookRepository],
  exports: [BooksService, BookRepository],
})
export class BooksModule {}
