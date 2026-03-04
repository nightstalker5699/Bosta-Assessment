import { z } from 'zod';
import { UserSchema } from 'src/modules/users/entities/user.entity';
import { BookSchema } from 'src/modules/books/entities/book.entity';

export const BorrowingSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  bookId: z.string().uuid(),
  status: z.enum(['BORROWED', 'RETURNED']),
  borrowDate: z.preprocess(
    (val) => (val instanceof Date ? val.toISOString() : val),
    z.string().datetime(),
  ),
  dueDate: z.preprocess(
    (val) => (val instanceof Date ? val.toISOString() : val),
    z.string().datetime(),
  ),
  returnDate: z.preprocess(
    (val) => (val instanceof Date ? val.toISOString() : val),
    z.string().datetime().nullable().optional(),
  ),
  createdAt: z.preprocess(
    (val) => (val instanceof Date ? val.toISOString() : val),
    z.string().datetime(),
  ),
  updatedAt: z.preprocess(
    (val) => (val instanceof Date ? val.toISOString() : val),
    z.string().datetime(),
  ),
  user: UserSchema.optional(),
  book: BookSchema.optional(),
});

export type Borrowing = z.infer<typeof BorrowingSchema>;
