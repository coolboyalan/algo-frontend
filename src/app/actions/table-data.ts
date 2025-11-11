'use server';

export type SortOrder = 'asc' | 'desc';

export interface TableFilter {
  field: string;
  operator: 'equals' | 'contains' | 'gt' | 'lt' | 'gte' | 'lte' | 'in';
  value: any;
}

export interface TableParams {
  cursor?: string;
  limit?: number;
  sortBy?: string;
  sortOrder?: SortOrder;
  searchQuery?: string;
  searchFields?: string[];
  filters?: TableFilter[];
}

export interface TableResponse<T> {
  data: T[];
  pagination: {
    hasMore: boolean;
    nextCursor: string | null;
    prevCursor: string | null;
    totalCount?: number;
  };
}

/**
 * Auto-seed collection if it doesn't exist (Development Only)
 */
async function ensureCollectionExists<T>(
  endpoint: string,
  sampleRecord: T
): Promise<void> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

    // Check if collection exists by trying to fetch
    const checkResponse = await fetch(
      `${baseUrl}${endpoint}?limit=1`,
      { cache: 'no-store' }
    );

    if (checkResponse.status === 404) {
      console.log(`🌱 Collection not found, auto-seeding: ${endpoint}`);

      // Seed the collection
      const seedResponse = await fetch(
        `${baseUrl}${endpoint}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(sampleRecord),
        }
      );

      if (!seedResponse.ok) {
        throw new Error(`Failed to seed collection: ${seedResponse.status}`);
      }

      const result = await seedResponse.json();
      console.log(`✅ Auto-seeded ${result.count} records for ${endpoint}`);
    } else {
      console.log(`✓ Collection exists: ${endpoint}`);
    }
  } catch (error) {
    console.error('Error ensuring collection exists:', error);
  }
}

/**
 * Generic server-side table data fetcher with auto-seeding
 */
export async function fetchTableData<T>(
  endpoint: string,
  params: TableParams,
  sampleRecord?: T  // ← NEW: Optional sample record for auto-seeding
): Promise<TableResponse<T>> {
  try {
    // Auto-seed if sample record provided
    if (sampleRecord) {
      await ensureCollectionExists(endpoint, sampleRecord);
    }

    const {
      cursor,
      limit = 10,
      sortBy,
      sortOrder = 'asc',
      searchQuery,
      searchFields = [],
      filters = [],
    } = params;

    const queryParams = new URLSearchParams();

    if (cursor) queryParams.append('cursor', cursor);
    queryParams.append('limit', limit.toString());
    if (sortBy) queryParams.append('sortBy', sortBy);
    if (sortOrder) queryParams.append('sortOrder', sortOrder);
    if (searchQuery) queryParams.append('searchQuery', searchQuery);
    if (searchFields.length > 0) {
      queryParams.append('searchFields', searchFields.join(','));
    }

    filters.forEach((filter, idx) => {
      queryParams.append(`filters[${idx}][field]`, filter.field);
      queryParams.append(`filters[${idx}][operator]`, filter.operator);
      queryParams.append(`filters[${idx}][value]`, String(filter.value));
    });

    // Use NEXT_PUBLIC_API_BASE_URL or default to localhost
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
    const response = await fetch(
      `${baseUrl}${endpoint}?${queryParams}`,
      {
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();

    return {
      data: result.data,
      pagination: {
        hasMore: result.pagination.hasMore,
        nextCursor: result.pagination.nextCursor,
        prevCursor: result.pagination.prevCursor,
        totalCount: result.pagination.totalCount,
      },
    };
  } catch (error) {
    console.error('Error fetching table data:', error);
    throw error;
  }
}
