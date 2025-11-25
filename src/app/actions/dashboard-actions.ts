"use server";

import { cookies } from "next/headers";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

// Types (not exported - internal only)
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

// Internal helper function
async function handleResponse<T>(response: Response): Promise<T> {
  const data: ApiResponse<T> = await response.json();

  if (!data.success) {
    const error = new Error(data.error.message) as any;
    error.code = data.error.code;
    error.statusCode = response.status;
    error.details = data.error.details;
    throw error;
  }

  return data.data;
}

// Only async function - can be exported
export async function getDashboardData() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      const error = new Error("No authentication token found") as any;
      error.code = "UNAUTHORIZED";
      error.statusCode = 401;
      throw error;
    }

    const response = await fetch(`${API_BASE_URL}/api/dashboard`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const error = new Error(
        `Failed to fetch dashboard data: ${response.statusText}`,
      ) as any;
      error.code = "FETCH_ERROR";
      error.statusCode = response.status;
      throw error;
    }

    return await handleResponse(response);
  } catch (error: any) {
    console.error("Dashboard fetch error:", error);
    throw error;
  }
}
