"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { apiPost } from "@/lib/api-client";

export type LoginState = {
  error?: string;
  success?: boolean;
};

export async function loginAction(
  prevState: LoginState | undefined,
  formData: FormData,
): Promise<LoginState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Validation
  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters" };
  }

  try {
    // Call your backend API
    const response = await apiPost("/api/user/login", {
      email,
      password,
    });

    // Await cookies() first before setting
    const cookieStore = await cookies();

    cookieStore.set("token", response.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    cookieStore.set("userRole", response.user.role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    cookieStore.set("user", JSON.stringify(response.user), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
  } catch (error: any) {
    return {
      error: error.message || "Invalid email or password",
    };
  }

  // Redirect based on role (this happens AFTER the action completes)
  const userRole = formData.get("userRole") || "user";
  if (userRole === "admin" || userRole === "super_admin") {
    redirect("/dashboard");
  } else {
    redirect("/dashboard");
  }
}

export async function signupAction(
  prevState: LoginState | undefined,
  formData: FormData,
): Promise<LoginState> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  // Validation
  if (!name || !email || !password || !confirmPassword) {
    return { error: "All fields are required" };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match" };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters" };
  }

  try {
    const response = await apiPost("/api/user", {
      name,
      email,
      password,
    });

    const cookieStore = await cookies();

    cookieStore.set("token", response.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    cookieStore.set("userRole", response.user.role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    cookieStore.set("user", JSON.stringify(response.user), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
  } catch (error: any) {
    return {
      error: error.message || "Signup failed. Please try again.",
    };
  }

  redirect("/dashboard");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("token");
  cookieStore.delete("userRole");
  cookieStore.delete("user");
  redirect("/login");
}
