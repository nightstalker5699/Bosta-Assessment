import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const reportFormatSchema = z.object({
  format: z.enum(['xlsx', 'csv']),
});

export class ReportFormatDto extends createZodDto(reportFormatSchema) {}

const reportQuerySchema = reportFormatSchema.extend({
  from: z
    .string()
    .transform((val) => new Date(val))
    .describe('From date in DD-MM-YYYY format'),
  to: z
    .string()
    .transform((val) => new Date(val))
    .describe('To date in DD-MM-YYYY format'),
});

export class ReportQueryDto extends createZodDto(reportQuerySchema) {}
