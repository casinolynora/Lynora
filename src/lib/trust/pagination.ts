/**
 * Pagination utility for reviews and complaints.
 *
 * Uses offset/limit pagination with sensible defaults.
 * Cursor-based pagination can be added later if needed.
 */

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

/**
 * Parse and validate pagination parameters from query string values.
 */
export function parsePaginationParams(
  page?: string | number,
  limit?: string | number,
): PaginationParams {
  const parsedPage = Math.max(1, Number(page) || DEFAULT_PAGE);
  const parsedLimit = Math.min(
    MAX_LIMIT,
    Math.max(1, Number(limit) || DEFAULT_LIMIT),
  );

  return { page: parsedPage, limit: parsedLimit };
}

/**
 * Calculate offset from page and limit.
 */
export function getOffset(params: PaginationParams): number {
  return (params.page - 1) * params.limit;
}

/**
 * Build a paginated result from a full dataset and pagination params.
 */
export function paginate<T>(
  data: T[],
  params: PaginationParams,
): PaginationResult<T> {
  const total = data.length;
  const totalPages = Math.ceil(total / params.limit);
  const offset = getOffset(params);
  const paginatedData = data.slice(offset, offset + params.limit);

  return {
    data: paginatedData,
    pagination: {
      page: params.page,
      limit: params.limit,
      total,
      totalPages,
      hasNext: params.page < totalPages,
      hasPrev: params.page > 1,
    },
  };
}

/**
 * Apply pagination to a pre-filtered dataset.
 * For use with SQLite queries that already have WHERE clauses.
 */
export function applyPagination<T>(
  queryFn: (offset: number, limit: number) => T[],
  countFn: () => number,
  params: PaginationParams,
): PaginationResult<T> {
  const total = countFn();
  const totalPages = Math.ceil(total / params.limit);
  const offset = getOffset(params);
  const data = queryFn(offset, params.limit);

  return {
    data,
    pagination: {
      page: params.page,
      limit: params.limit,
      total,
      totalPages,
      hasNext: params.page < totalPages,
      hasPrev: params.page > 1,
    },
  };
}
