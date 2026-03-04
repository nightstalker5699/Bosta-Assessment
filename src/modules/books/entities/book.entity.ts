import { z } from 'zod';

export const BookSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  author: z.string().min(1),
  isbn: z.string().min(1),
  shelfLocation: z.string().min(1),
  availableQuantity: z.number().int().min(0),
  createdAt: z
    .preprocess(
      (val) => (val instanceof Date ? val.toISOString() : val),
      z.string().datetime(),
    )
    .describe('2022-01-01T00:00:00.000Z'),
  updatedAt: z.preprocess(
    (val) => (val instanceof Date ? val.toISOString() : val),
    z.string().datetime(),
  ),
});

export type Book = z.infer<typeof BookSchema>;
