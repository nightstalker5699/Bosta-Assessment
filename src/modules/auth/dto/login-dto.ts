import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const loginSchema = z.object({
  email: z.email({ error: 'Invalid email format' }),
  password: z
    .string({ error: 'password must be string' })
    .min(6, { error: 'password must be at least 6 characters long' }),
});

export class LoginDto extends createZodDto(loginSchema) {}
