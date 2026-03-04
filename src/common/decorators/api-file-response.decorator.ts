import { applyDecorators } from '@nestjs/common';
import { ApiProduces, ApiResponse } from '@nestjs/swagger';

export function ApiFileResponse(description = 'Returns a CSV or XLSX file') {
  return applyDecorators(
    ApiProduces(
      'text/csv',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ),
    ApiResponse({
      status: 200,
      description,
      content: {
        'text/csv': {
          schema: { type: 'string', format: 'binary' },
        },
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
          schema: { type: 'string', format: 'binary' },
        },
      },
    }),
  );
}
