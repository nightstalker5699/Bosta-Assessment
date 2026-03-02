import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

// This function creates a Zod Schema dynamically
export const createApiResponseSchema = <T extends z.ZodTypeAny>(
  dataSchema: T,
) =>
  z.object({
    success: z.boolean().default(true),
    message: z.string().optional(),
    data: dataSchema,
  });

// Usage example for a single User
// export c
