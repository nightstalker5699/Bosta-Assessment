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
import { BorrowingsService } from './borrowings.service';
import { CreateBorrowingDto, UpdateBorrowingDto } from './dto/borrowing.dto';
import {
  BorrowingResponseDto,
  PaginatedBorrowingResponseDto,
} from './dto/borrowing-response.dto';
import { Role, Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/currentUser.decorator';
import type { User } from '../../generated/prisma/client.js';
import { ZodSerializerDto } from 'nestjs-zod';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationQueryDto } from 'src/common/dto/pagination.dto';

@ApiTags('borrowings')
@Controller('borrowings')
export class BorrowingsController {
  constructor(private readonly borrowingsService: BorrowingsService) {}

  @ZodSerializerDto(BorrowingResponseDto)
  @Roles(Role.USER, Role.ADMIN)
  @Post()
  @ApiResponse({ status: 201, type: BorrowingResponseDto })
  async create(
    @Body() createBorrowingDto: CreateBorrowingDto,
    @CurrentUser() user: User,
  ) {
    // If user is regular USER, they borrow for themselves.
    // If ADMIN, they can provide a userId in the body.
    const targetUserId =
      user.role === 'ADMIN' && createBorrowingDto.userId
        ? createBorrowingDto.userId
        : user.id;

    const borrowing = await this.borrowingsService.borrowBook(
      targetUserId,
      createBorrowingDto.bookId,
    );
    return {
      message: 'Book borrowed successfully',
      success: true,
      data: borrowing,
    };
  }

  @ZodSerializerDto(PaginatedBorrowingResponseDto)
  @Roles(Role.ADMIN)
  @Get()
  @ApiResponse({ status: 200, type: PaginatedBorrowingResponseDto })
  async findAll(@Query() query: PaginationQueryDto) {
    const result = await this.borrowingsService.findAll(query);
    return {
      message: 'Borrowing records fetched successfully',
      success: true,
      ...result,
    };
  }

  @ZodSerializerDto(BorrowingResponseDto)
  @Roles(Role.ADMIN)
  @Get(':id')
  @ApiResponse({ status: 200, type: BorrowingResponseDto })
  async findOne(@Param('id') id: string) {
    const borrowing = await this.borrowingsService.findOne(id);
    return {
      message: 'Borrowing record fetched successfully',
      success: true,
      data: borrowing,
    };
  }

  @ZodSerializerDto(BorrowingResponseDto)
  @Roles(Role.ADMIN)
  @Patch(':id/return')
  @ApiResponse({ status: 200, type: BorrowingResponseDto })
  async returnBook(@Param('id') id: string) {
    const borrowing = await this.borrowingsService.returnBook(id);
    return {
      message: 'Book returned successfully',
      success: true,
      data: borrowing,
    };
  }

  @ZodSerializerDto(BorrowingResponseDto)
  @Roles(Role.ADMIN)
  @Delete(':id')
  @ApiResponse({ status: 200, type: BorrowingResponseDto })
  async remove(@Param('id') id: string) {
    const borrowing = await this.borrowingsService.remove(id);
    return {
      message: 'Borrowing record deleted successfully',
      success: true,
      data: borrowing,
    };
  }
}
