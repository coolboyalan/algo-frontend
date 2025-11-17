'use server';

import { prisma } from '@/lib/prisma';
import { TableParams, TableResponse } from './table-data';

export async function getFlights(params: TableParams): Promise<TableResponse<any>> {
  const {
    limit = 10,
    cursor,
    sortBy = 'departureTime',
    sortOrder = 'asc',
    search,
    searchFields,
    filters,
  } = params;

  // Build where clause
  const where: any = {};

  // Search
  if (search && searchFields) {
    where.OR = searchFields.map((field) => ({
      [field]: { contains: search, mode: 'insensitive' },
    }));
  }

  // Filters
  if (filters) {
    filters.forEach((filter) => {
      where[filter.field] = filter.value;
    });
  }

  // Cursor pagination
  const [data, totalCount] = await Promise.all([
    prisma.flight.findMany({
      where,
      take: limit + 1,
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
      orderBy: { [sortBy]: sortOrder },
    }),
    prisma.flight.count({ where }),
  ]);

  const hasNextPage = data.length > limit;
  const hasPreviousPage = !!cursor;
  const results = hasNextPage ? data.slice(0, -1) : data;

  return {
    data: results,
    pagination: {
      hasNextPage,
      hasPreviousPage,
      nextCursor: hasNextPage ? results[results.length - 1].id : null,
      previousCursor: cursor || null,
      totalCount,
    },
  };
}
