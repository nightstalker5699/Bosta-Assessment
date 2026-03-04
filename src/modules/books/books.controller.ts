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
import { BooksService } from './books.service';
import { CreateBookDto, UpdateBookDto } from './dto/book.dto';
import {
  BookResponseDto,
  PaginatedBookResponseDto,
} from './dto/book-response.dto';
import { Role, Roles } from 'src/common/decorators/roles.decorator';
import { Public } from 'src/common/decorators/is-public.decorator';
import { ZodSerializerDto } from 'nestjs-zod';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationQueryDto } from 'src/common/dto/pagination.dto';

@ApiTags('books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @ZodSerializerDto(BookResponseDto)
  @Roles(Role.ADMIN)
  @Post()
  @ApiResponse({ status: 201, type: BookResponseDto })
  async create(@Body() createBookDto: CreateBookDto) {
    const book = await this.booksService.create(createBookDto);
    return { message: 'Book created successfully', success: true, data: book };
  }

  @ZodSerializerDto(PaginatedBookResponseDto)
  @Public()
  @Get()
  @ApiResponse({ status: 200, type: PaginatedBookResponseDto })
  async findAll(@Query() query: PaginationQueryDto) {
    const result = await this.booksService.findAllPaginated(query);
    return {
      message: 'Books fetched successfully',
      success: true,
      ...result,
    };
  }

  @ZodSerializerDto(BookResponseDto)
  @Public()
  @Get(':id')
  @ApiResponse({ status: 200, type: BookResponseDto })
  async findOne(@Param('id') id: string) {
    const book = await this.booksService.findOne(id);
    return { message: 'Book fetched successfully', success: true, data: book };
  }

  @ZodSerializerDto(BookResponseDto)
  @Roles(Role.ADMIN)
  @Patch(':id')
  @ApiResponse({ status: 200, type: BookResponseDto })
  async update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    const book = await this.booksService.update(id, updateBookDto);
    return { message: 'Book updated successfully', success: true, data: book };
  }

  @ZodSerializerDto(BookResponseDto)
  @Roles(Role.ADMIN)
  @Delete(':id')
  @ApiResponse({ status: 200, type: BookResponseDto })
  async remove(@Param('id') id: string) {
    const book = await this.booksService.remove(id);
    return { message: 'Book deleted successfully', success: true, data: book };
  }
}
