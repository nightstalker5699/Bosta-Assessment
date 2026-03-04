import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BorrowingsService } from './borrowings.service';
import {
  BorrowingResponseDto,
  PaginatedBorrowingResponseDto,
} from './dto/borrowing-response.dto';
import {
  BorrowingQueryDto,
  CreateBorrowingDto,
  CreateBorrowingForMyselfDto,
} from './dto/borrowing.dto';
import { Role, Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/currentUser.decorator';
import type { User } from '../../generated/prisma/client.js';
import { ZodSerializerDto } from 'nestjs-zod';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { BorrowingOwnerGuard } from './guards/borrowing-owner.guard';

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
    const borrowing = await this.borrowingsService.borrowBook(
      createBorrowingDto.userId,
      createBorrowingDto.bookId,
    );
    return {
      message: 'Book borrowed successfully',
      success: true,
      data: borrowing,
    };
  }

  @ZodSerializerDto(BorrowingResponseDto)
  @Post('me')
  @ApiResponse({ status: 201, type: BorrowingResponseDto })
  async borrowForMyself(
    @Body() createBorrowingForMyselfDto: CreateBorrowingForMyselfDto,
    @CurrentUser() user: User,
  ) {
    const borrowing = await this.borrowingsService.borrowBook(
      user.id,
      createBorrowingForMyselfDto.bookId,
    );
    return {
      message: 'Book borrowed successfully',
      success: true,
      data: borrowing,
    };
  }

  @ZodSerializerDto(PaginatedBorrowingResponseDto)
  @Get('me')
  @ApiResponse({ status: 200, type: PaginatedBorrowingResponseDto })
  async findMyBorrowings(
    @Query() query: BorrowingQueryDto,
    @CurrentUser() user: User,
  ) {
    const result = await this.borrowingsService.findAll(query, user.id);
    return {
      message: 'Your borrowing records fetched successfully',
      success: true,
      ...result,
    };
  }

  @ZodSerializerDto(PaginatedBorrowingResponseDto)
  @Roles(Role.ADMIN)
  @Get()
  @ApiResponse({ status: 200, type: PaginatedBorrowingResponseDto })
  async findAll(@Query() query: BorrowingQueryDto) {
    const result = await this.borrowingsService.findAll(query);
    return {
      message: 'Borrowing records fetched successfully',
      success: true,
      ...result,
    };
  }

  @ZodSerializerDto(PaginatedBorrowingResponseDto)
  @Roles(Role.ADMIN)
  @Get('user/:userId')
  @ApiResponse({ status: 200, type: PaginatedBorrowingResponseDto })
  async findUserBorrowings(
    @Param('userId') userId: string,
    @Query() query: BorrowingQueryDto,
  ) {
    const result = await this.borrowingsService.findAll(query, userId);
    return {
      message: 'User borrowing records fetched successfully',
      success: true,
      ...result,
    };
  }

  @ZodSerializerDto(PaginatedBorrowingResponseDto)
  @Roles(Role.ADMIN)
  @Get('book/:bookId')
  @ApiResponse({ status: 200, type: PaginatedBorrowingResponseDto })
  async findBookBorrowings(
    @Param('bookId') bookId: string,
    @Query() query: BorrowingQueryDto,
  ) {
    const result = await this.borrowingsService.findAll(
      query,
      undefined,
      bookId,
    );
    return {
      message: 'Book borrowing records fetched successfully',
      success: true,
      ...result,
    };
  }

  @ZodSerializerDto(BorrowingResponseDto)
  @UseGuards(BorrowingOwnerGuard)
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
  @UseGuards(BorrowingOwnerGuard)
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
