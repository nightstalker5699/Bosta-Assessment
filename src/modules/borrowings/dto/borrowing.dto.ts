import { createZodDto } from 'nestjs-zod';
import { BorrowingSchema } from '../entities/borrowing.entity';
import { z } from 'zod';

export const CreateBorrowingSchema = z.object({
  bookId: z.string().uuid(),
  userId: z.string().uuid(),
});

export class CreateBorrowingDto extends createZodDto(CreateBorrowingSchema) {}

export const CreateBorrowingForMyselfSchema = z.object({
  bookId: z.string().uuid(),
});

export class CreateBorrowingForMyselfDto extends createZodDto(
  CreateBorrowingForMyselfSchema,
) {}

export const UpdateBorrowingSchema = z.object({
  status: z.enum(['BORROWED', 'RETURNED']).optional(),
  dueDate: z.string().datetime().optional(),
});

export class UpdateBorrowingDto extends createZodDto(UpdateBorrowingSchema) {}

import { PaginationQuerySchema } from 'src/common/dto/pagination.dto';

export const BorrowingQuerySchema = PaginationQuerySchema.extend({
  status: z.enum(['BORROWED', 'RETURNED']).optional(),
  overdue: z
    .enum(['true', 'false'])
    .transform((val) => val === 'true')
    .optional(),
});

export class BorrowingQueryDto extends createZodDto(BorrowingQuerySchema) {}
