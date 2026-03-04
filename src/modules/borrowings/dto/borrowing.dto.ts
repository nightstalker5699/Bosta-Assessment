import { createZodDto } from 'nestjs-zod';
import { BorrowingSchema } from '../entities/borrowing.entity';
import { z } from 'zod';

export const CreateBorrowingSchema = z.object({
  bookId: z.string().uuid(),
  userId: z.string().uuid().optional(), // Optional if user is borrowing for themselves
});

export class CreateBorrowingDto extends createZodDto(CreateBorrowingSchema) {}

export const UpdateBorrowingSchema = z.object({
  status: z.enum(['BORROWED', 'RETURNED']).optional(),
  dueDate: z.string().datetime().optional(),
});

export class UpdateBorrowingDto extends createZodDto(UpdateBorrowingSchema) {}
