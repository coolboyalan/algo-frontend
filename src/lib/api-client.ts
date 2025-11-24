// lib/api-client.ts

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export interface ApiSuccessResponse<T = any> {
  success: true;
  message: string;
  data: T;
  timestamp: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number,
    public details?: any,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Helper to determine if string is a full URL
function isFullUrl(url: string): boolean {
  return url.startsWith("http://") || url.startsWith("https://");
}

// Helper to build the full URL
function buildUrl(endpoint: string): string {
  return isFullUrl(endpoint) ? endpoint : `${API_BASE_URL}${endpoint}`;
}

// Helper to get auth token (works on both client and server)
function getAuthToken(): string | null {
  // Client-side: get from localStorage
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  // Server-side: would need to get from cookies or headers
  return null;
}

async function handleResponse<T>(response: Response): Promise<T> {
  const data: ApiResponse<T> = await response.json();

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

// GET request
export async function apiGet<T = any>(
  endpoint: string,
  params?: Record<string, any>,
  options?: RequestInit,
): Promise<T> {
  const fullUrl = buildUrl(endpoint);
  const url = new URL(fullUrl);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          url.searchParams.append(key, JSON.stringify(value));
        } else {
          url.searchParams.append(key, String(value));
        }
      }
    });
  }

  const token = getAuthToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options?.headers,
  };

  const response = await fetch(url.toString(), {
    method: "GET",
    headers,
    cache: "no-store",
    ...options,
  });

  return handleResponse<T>(response);
}

// POST request
export async function apiPost<T = any>(
  endpoint: string,
  body?: any,
  options?: RequestInit,
): Promise<T> {
  const fullUrl = buildUrl(endpoint);
  const token = getAuthToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options?.headers,
  };

  const response = await fetch(fullUrl, {
    method: "POST",
    headers,
    body: body ? JSON.stringify(body) : undefined,
    ...options,
  });

  return handleResponse<T>(response);
}

// PUT request
export async function apiPut<T = any>(
  endpoint: string,
  body?: any,
  options?: RequestInit,
): Promise<T> {
  const fullUrl = buildUrl(endpoint);
  const token = getAuthToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options?.headers,
  };

  const response = await fetch(fullUrl, {
    method: "PUT",
    headers,
    body: body ? JSON.stringify(body) : undefined,
    ...options,
  });

  return handleResponse<T>(response);
}

// PATCH request
export async function apiPatch<T = any>(
  endpoint: string,
  body?: any,
  options?: RequestInit,
): Promise<T> {
  const fullUrl = buildUrl(endpoint);
  const token = getAuthToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options?.headers,
  };

  const response = await fetch(fullUrl, {
    method: "PATCH",
    headers,
    body: body ? JSON.stringify(body) : undefined,
    ...options,
  });

  return handleResponse<T>(response);
}

// DELETE request
export async function apiDelete<T = any>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const fullUrl = buildUrl(endpoint);
  const token = getAuthToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options?.headers,
  };

  const response = await fetch(fullUrl, {
    method: "DELETE",
    headers,
    ...options,
  });

  return handleResponse<T>(response);
}
