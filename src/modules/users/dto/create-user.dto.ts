import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const createUserSchema = z.object({
  name: z
    .string({ error: 'Name is required' })
    .min(3, { message: 'Name must be at least 3 characters long' }),
  email: z.email({ error: 'Email is required' }),
  password: z
    .string({ error: 'Password is required' })
    .min(6, { message: 'Password must be at least 6 characters long' }),
});

export class CreateUserDto extends createZodDto(createUserSchema) {}
