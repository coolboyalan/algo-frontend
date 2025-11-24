"use server";

import { cookies } from "next/headers";
import { ApiError } from "@/lib/api-error";

export type SortOrder = "asc" | "desc";

export interface TableFilter {
  field: string;
  operator: "equals" | "contains" | "gt" | "lt" | "gte" | "lte" | "in";
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

export interface TablePagination {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextCursor: string | null;
  previousCursor: string | null;
  totalCount?: number;
}

export interface TableResponse<T> {
  data: T[];
  pagination: TablePagination;
}

interface ApiSuccessResponse<T = any> {
  success: true;
  message: string;
  data: T;
  timestamp: string;
}

interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}

type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Handle API response and throw errors if needed
 */
async function handleApiResponse<T>(response: Response): Promise<T> {
  let data: ApiResponse<T>;

  try {
    data = await response.json();
  } catch (error) {
    throw new ApiError(
      "PARSE_ERROR",
      "Failed to parse API response",
      response.status,
    );
  }

  if (!data.success) {
    throw new ApiError(
      data.error.code,
      data.error.message,
      response.status,
      data.error.details,
    );
  }

  return data.data;
}

/**
 * Read auth token from cookies and return Authorization header
 */
async function getAuthHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return {};
  return {
    Authorization: `Bearer ${token}`,
  };
}

/**
 * Auto-seed collection if it doesn't exist (Development Only)
 */
async function ensureCollectionExists<T>(
  endpoint: string,
  sampleRecord: T,
): Promise<void> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

    // Check if collection exists by trying to fetch
    const checkResponse = await fetch(`${baseUrl}${endpoint}?limit=1`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (checkResponse.status === 404) {
      console.log(`🌱 Collection not found, auto-seeding: ${endpoint}`);

      // Seed the collection
      const seedResponse = await fetch(`${baseUrl}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sampleRecord),
      });

      if (!seedResponse.ok) {
        await handleApiResponse(seedResponse);
        throw new Error(`Failed to seed collection: ${seedResponse.status}`);
      }

      const result = await handleApiResponse<{ count: number; sample: T }>(
        seedResponse,
      );
      console.log(`✅ Auto-seeded ${result.count} records for ${endpoint}`);
    } else if (checkResponse.ok) {
      console.log(`✓ Collection exists: ${endpoint}`);
    } else {
      // Handle other errors
      await handleApiResponse(checkResponse);
    }
  } catch (error) {
    if (error instanceof ApiError) {
      console.error(`API Error [${error.code}]:`, error.message);
      // Don't rethrow - seeding is optional
    } else {
      console.error("Error ensuring collection exists:", error);
    }
  }
}

/**
 * Generic server-side table data fetcher with standardized API responses
 * Supports cursor pagination, search, filters, and sorting
 */
export async function fetchTableData<T>(
  endpoint: string,
  params: TableParams,
  sampleRecord?: T,
): Promise<TableResponse<T>> {
  try {
    if (sampleRecord && process.env.NODE_ENV === "development") {
      await ensureCollectionExists(endpoint, sampleRecord);
    }

    const {
      cursor,
      limit = 10,
      sortBy,
      sortOrder = "asc",
      searchQuery,
      searchFields = [],
      filters = [],
    } = params;

    // Build query parameters
    const queryParams = new URLSearchParams();

    if (cursor) queryParams.append("cursor", cursor);
    queryParams.append("limit", limit.toString());
    if (sortBy) queryParams.append("sortBy", sortBy);
    if (sortOrder) queryParams.append("sortOrder", sortOrder);
    if (searchQuery) queryParams.append("searchQuery", searchQuery);
    if (searchFields.length > 0) {
      queryParams.append("searchFields", searchFields.join(","));
    }

    filters.forEach((filter, idx) => {
      queryParams.append(`filters[${idx}][field]`, filter.field);
      queryParams.append(`filters[${idx}][operator]`, filter.operator);
      queryParams.append(`filters[${idx}][value]`, String(filter.value));
    });

    const baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";
    const url = `${baseUrl}${endpoint}?${queryParams.toString()}`;

    console.log(`🔄 Fetching table data: ${url}`);

    const headers = {
      "Content-Type": "application/json",
      ...(await getAuthHeaders()),
    };

    const response = await fetch(url, {
      cache: "no-store",
      headers,
    });

    const result = await handleApiResponse<TableResponse<T>>(response);

    console.log(`✅ Fetched ${result.data.length} records from ${endpoint}`);

    return {
      data: result.data,
      pagination: {
        hasNextPage: result.pagination.hasNextPage,
        hasPreviousPage: result.pagination.hasPreviousPage,
        nextCursor: result.pagination.nextCursor,
        previousCursor: result.pagination.previousCursor,
        totalCount: result.pagination.totalCount,
      },
    };
  } catch (error) {
    if (error instanceof ApiError) {
      console.error(`❌ API Error [${error.code}]:`, error.message);

      if (error.code === "NOT_FOUND") {
        throw new Error(`Collection not found: ${endpoint}`);
      }

      if (error.code === "VALIDATION_ERROR") {
        throw new Error(`Invalid request parameters: ${error.message}`);
      }

      throw new Error(`API Error: ${error.message}`);
    }

    console.error("❌ Unexpected error fetching table data:", error);
    throw new Error("Failed to fetch table data. Please try again.");
  }
}

/**
 * Fetch single record by ID
 */
export async function fetchRecordById<T>(
  endpoint: string,
  id: string,
): Promise<T> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";
    const url = `${baseUrl}${endpoint}/${id}`;

    console.log(`🔄 Fetching record: ${url}`);

    const headers = {
      "Content-Type": "application/json",
      ...(await getAuthHeaders()),
    };

    const response = await fetch(url, {
      cache: "no-store",
      headers,
    });

    const result = await handleApiResponse<T>(response);
    console.log(`✅ Fetched record ${id} from ${endpoint}`);

    return result;
  } catch (error) {
    if (error instanceof ApiError) {
      console.error(`❌ API Error [${error.code}]:`, error.message);

      if (error.code === "NOT_FOUND") {
        throw new Error(`Record not found: ${id}`);
      }

      throw new Error(`API Error: ${error.message}`);
    }

    console.error("❌ Unexpected error fetching record:", error);
    throw new Error("Failed to fetch record. Please try again.");
  }
}

/**
 * Create new record
 */
export async function createRecord<T>(
  endpoint: string,
  data: Partial<T>,
): Promise<T> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";
    const url = `${baseUrl}${endpoint}`;

    console.log(`🔄 Creating record: ${url}`);

    const headers = {
      "Content-Type": "application/json",
      ...(await getAuthHeaders()),
    };

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });

    const result = await handleApiResponse<T>(response);
    console.log(`✅ Created record in ${endpoint}`);

    return result;
  } catch (error) {
    if (error instanceof ApiError) {
      console.error(`❌ API Error [${error.code}]:`, error.message);

      if (error.code === "VALIDATION_ERROR") {
        throw new Error(`Validation failed: ${error.message}`);
      }

      if (error.code === "CONFLICT") {
        throw new Error(`Record already exists: ${error.message}`);
      }

      throw new Error(`API Error: ${error.message}`);
    }

    console.error("❌ Unexpected error creating record:", error);
    throw new Error("Failed to create record. Please try again.");
  }
}

/**
 * Update existing record
 */
export async function updateRecord<T>(
  endpoint: string,
  id: string,
  data: Partial<T>,
): Promise<T> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";
    const url = `${baseUrl}${endpoint}/${id}`;

    console.log(`🔄 Updating record: ${url}`);

    const headers = {
      "Content-Type": "application/json",
      ...(await getAuthHeaders()),
    };

    const response = await fetch(url, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    });

    const result = await handleApiResponse<T>(response);
    console.log(`✅ Updated record ${id} in ${endpoint}`);

    return result;
  } catch (error) {
    if (error instanceof ApiError) {
      console.error(`❌ API Error [${error.code}]:`, error.message);

      if (error.code === "NOT_FOUND") {
        throw new Error(`Record not found: ${id}`);
      }

      if (error.code === "VALIDATION_ERROR") {
        throw new Error(`Validation failed: ${error.message}`);
      }

      throw new Error(`API Error: ${error.message}`);
    }

    console.error("❌ Unexpected error updating record:", error);
    throw new Error("Failed to update record. Please try again.");
  }
}

/**
 * Delete record
 */
export async function deleteRecord(
  endpoint: string,
  id: string,
): Promise<void> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";
    const url = `${baseUrl}${endpoint}/${id}`;

    console.log(`🔄 Deleting record: ${url}`);

    const headers = {
      "Content-Type": "application/json",
      ...(await getAuthHeaders()),
    };

    const response = await fetch(url, {
      method: "DELETE",
      headers,
    });

    await handleApiResponse<void>(response);
    console.log(`✅ Deleted record ${id} from ${endpoint}`);
  } catch (error) {
    if (error instanceof ApiError) {
      console.error(`❌ API Error [${error.code}]:`, error.message);

      if (error.code === "NOT_FOUND") {
        throw new Error(`Record not found: ${id}`);
      }

      throw new Error(`API Error: ${error.message}`);
    }

    console.error("❌ Unexpected error deleting record:", error);
    throw new Error("Failed to delete record. Please try again.");
  }
}
