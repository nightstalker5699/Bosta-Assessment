import { createApiResponseSchema } from 'src/common/dto/response.dto';
import { createPaginatedResponseSchema } from 'src/common/dto/pagination.dto';
import { BorrowingSchema } from '../entities/borrowing.entity';
import { createZodDto } from 'nestjs-zod';

export const BorrowingResponseSchema = createApiResponseSchema(BorrowingSchema);
export class BorrowingResponseDto extends createZodDto(
  BorrowingResponseSchema,
) {}

export const PaginatedBorrowingSchema =
  createPaginatedResponseSchema(BorrowingSchema);
export class PaginatedBorrowingResponseDto extends createZodDto(
  PaginatedBorrowingSchema,
) {}
