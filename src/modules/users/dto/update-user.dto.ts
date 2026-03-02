import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const updateUserSchema = z.object({
  name: z
    .string({ error: 'Name must be string' })
    .min(3, { message: 'Name must be at least 3 characters long' })
    .optional(),
  email: z.email({ error: 'Email must be valid email' }).optional(),
  password: z
    .string({ error: 'Password must be string' })
    .min(6, { message: 'Password must be at least 6 characters long' })
    .optional(),
});

export class UpdateUserDto extends createZodDto(updateUserSchema) {}
