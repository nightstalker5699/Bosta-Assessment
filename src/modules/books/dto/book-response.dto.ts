import { createApiResponseSchema } from 'src/common/dto/response.dto';
import { createPaginatedResponseSchema } from 'src/common/dto/pagination.dto';
import { BookSchema } from '../entities/book.entity';
import { createZodDto } from 'nestjs-zod';

export const BookResponseSchema = createApiResponseSchema(BookSchema);
export class BookResponseDto extends createZodDto(BookResponseSchema) {}

export const PaginatedBookSchema = createPaginatedResponseSchema(BookSchema);
export class PaginatedBookResponseDto extends createZodDto(
  PaginatedBookSchema,
) {}
