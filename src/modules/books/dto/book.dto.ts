import { createZodDto } from 'nestjs-zod';
import { BookSchema } from '../entities/book.entity';

export const CreateBookSchema = BookSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export class CreateBookDto extends createZodDto(CreateBookSchema) {}

export const UpdateBookSchema = CreateBookSchema.partial();

export class UpdateBookDto extends createZodDto(UpdateBookSchema) {}
