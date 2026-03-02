import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { Role } from 'src/common/decorators/roles.decorator';
export const UserSchema = z.object({
  id: z.string().uuid().describe('123e4567-e89b-12d3-a456-426614174000'),
  name: z.string().describe('John Doe'),
  email: z.email().describe('john.doe@example.com'),
  role: z.enum(Role).describe('USER'),

  // we used preprocess to convert Date to string since date do not work on swagger and
  // string is not with date so we convert it to datetime and cast a string to swagger
  createdAt: z
    .preprocess(
      (val) => (val instanceof Date ? val.toISOString() : val),
      z.string().datetime(),
    )
    .describe('2022-01-01T00:00:00.000Z'),
  updatedAt: z
    .preprocess(
      (val) => (val instanceof Date ? val.toISOString() : val),
      z.string().datetime(),
    )
    .describe('2022-01-01T00:00:00.000Z'),
  passwordChangedAt: z
    .preprocess(
      (val) => (val instanceof Date ? val.toISOString() : val),
      z.string().datetime().nullable().optional(),
    )
    .describe('2022-01-01T00:00:00.000Z'),
});

export type User = z.infer<typeof UserSchema>;

export const UserWithPasswordSchema = UserSchema.extend({
  password: z.string().describe('password'),
});

export type UserWithPassword = z.infer<typeof UserWithPasswordSchema>;
