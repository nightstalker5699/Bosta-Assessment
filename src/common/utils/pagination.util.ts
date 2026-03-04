import { PaginationQueryDto } from '../dto/pagination.dto';

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export async function paginate<T>(
  model: any,
  query: PaginationQueryDto,
  args: any = {},
  searchFields: string[] = [],
): Promise<PaginatedResult<T>> {
  const page = query.page || 1;
  const limit = query.limit || 10;
  const skip = (page - 1) * limit;

  // Clone args to avoid mutating the original object
  const findManyArgs = { ...args };

  // Handle Search
  if (query.search && searchFields.length > 0) {
    const searchFilter = {
      OR: searchFields.map((field) => ({
        [field]: { contains: query.search, mode: 'insensitive' },
      })),
    };

    if (findManyArgs.where) {
      findManyArgs.where = { AND: [findManyArgs.where, searchFilter] };
    } else {
      findManyArgs.where = searchFilter;
    }
  }

  // Handle Sorting
  if (query.sortBy) {
    findManyArgs.orderBy = { [query.sortBy]: query.sortOrder };
  }

  const [data, total] = await Promise.all([
    model.findMany({
      ...findManyArgs,
      skip,
      take: limit,
    }),
    model.count({ where: findManyArgs.where }),
  ]);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}
