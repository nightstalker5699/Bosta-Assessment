import { createApiResponseSchema } from 'src/common/dto/response.dto';
import { createPaginatedResponseSchema } from 'src/common/dto/pagination.dto';
import { UserSchema, UserWithPasswordSchema } from '../entities/user.entity';
import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

// create user response schema (data with message and success)
export const UserSchemaWithoutPassword = createApiResponseSchema(UserSchema);

export const UserWithPasswordResponseSchema = createApiResponseSchema(
  UserWithPasswordSchema,
);

// create user list response schema (data with message and success)
export const UserWithPasswordListSchema = createApiResponseSchema(
  z.array(UserWithPasswordSchema),
);

export const UserListSchemaWithoutPassword = createApiResponseSchema(
  z.array(UserSchema),
);

// create user response dto from the schema

export class UserResponseDto extends createZodDto(UserSchemaWithoutPassword) {}

export class UserListResponseDto extends createZodDto(
  UserListSchemaWithoutPassword,
) {}

// create user list response dto from the schema
export class UserWithPasswordDto extends createZodDto(
  UserWithPasswordResponseSchema,
) {}

export class UserWithPasswordListDto extends createZodDto(
  UserWithPasswordListSchema,
) {}

export const PaginatedUserSchema = createPaginatedResponseSchema(UserSchema);
export class PaginatedUserResponseDto extends createZodDto(
  PaginatedUserSchema,
) {}

export const UserSchemaWithToken = UserSchema.extend({
  token: z.string().describe('jwt token'),
});

export const UserAuthResponseSchema =
  createApiResponseSchema(UserSchemaWithToken);

export class UserAuthResponseDto extends createZodDto(UserAuthResponseSchema) {}
