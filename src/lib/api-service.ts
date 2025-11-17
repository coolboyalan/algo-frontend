'use server';

import { revalidatePath } from 'next/cache';

// Your backend API base URL (server-side only)
const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:4000';
const BACKEND_API_KEY = process.env.BACKEND_API_KEY; // Optional: if your backend needs auth

// Response types (matching your backend)
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

// Generic headers with optional auth
function getHeaders() {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Add auth header if API key is configured
  if (BACKEND_API_KEY) {
    headers['Authorization'] = `Bearer ${BACKEND_API_KEY}`;
  }

  return headers;
}

// Handle API response
async function handleResponse<T>(response: Response): Promise<T> {
  const data: ApiResponse<T> = await response.json();

  if (!data.success) {
    throw new Error(data.error.message);
  }

  return data.data;
}

// ============================================
// GENERIC CRUD OPERATIONS (Server Actions)
// ============================================

export async function apiCreate(
  resource: string,
  data: any,
  revalidatePaths?: string[]
) {
  try {
    const response = await fetch(`${BACKEND_API_URL}/${resource}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
      cache: 'no-store',
    });

    const result = await handleResponse(response);

    // Revalidate paths to update cache
    if (revalidatePaths) {
      revalidatePaths.forEach((path) => revalidatePath(path));
    }

    return { success: true, data: result };
  } catch (error) {
    console.error(`Create ${resource} error:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : `Failed to create ${resource}`,
    };
  }
}

export async function apiUpdate(
  resource: string,
  id: string,
  data: any,
  revalidatePaths?: string[]
) {
  try {
    const response = await fetch(`${BACKEND_API_URL}/${resource}/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
      cache: 'no-store',
    });

    const result = await handleResponse(response);

    // Revalidate paths
    if (revalidatePaths) {
      revalidatePaths.forEach((path) => revalidatePath(path));
    }

    return { success: true, data: result };
  } catch (error) {
    console.error(`Update ${resource} error:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : `Failed to update ${resource}`,
    };
  }
}

export async function apiDelete(
  resource: string,
  id: string,
  revalidatePaths?: string[]
) {
  try {
    const response = await fetch(`${BACKEND_API_URL}/${resource}/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
      cache: 'no-store',
    });

    await handleResponse(response);

    // Revalidate paths
    if (revalidatePaths) {
      revalidatePaths.forEach((path) => revalidatePath(path));
    }

    return { success: true };
  } catch (error) {
    console.error(`Delete ${resource} error:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : `Failed to delete ${resource}`,
    };
  }
}

export async function apiFetch(resource: string, params: any) {
  try {
    const response = await fetch(`${BACKEND_API_URL}/${resource}/query`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(params),
      cache: 'no-store',
    });

    return handleResponse(response);
  } catch (error) {
    console.error(`Fetch ${resource} error:`, error);
    throw error;
  }
}
