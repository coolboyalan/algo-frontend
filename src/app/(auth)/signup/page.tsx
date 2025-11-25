// app/(auth)/signup/page.tsx
"use client";
import { useActionState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { signupAction } from "@/lib/actions/auth";
import { useState } from "react";
import { adminConfig } from "@/config/admin-config";

export default function SignUpPage() {
  const [state, formAction, isPending] = useActionState(
    signupAction,
    undefined,
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="bg-card border border-border p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-md">
        {/* Logo Section */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl sm:text-2xl">
                A
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              {adminConfig.header.logo.text}
            </h2>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Create Account
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Sign up to get started
          </p>
        </div>

        {state?.error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive px-3 sm:px-4 py-2.5 sm:py-3 rounded-md mb-4 sm:mb-6 text-xs sm:text-sm">
            {state.error}
          </div>
        )}

        <form action={formAction} className="space-y-3.5 sm:space-y-4">
          {/* Name Field */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-foreground mb-1.5 sm:mb-2"
            >
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              placeholder="John Doe"
            />
          </div>

          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-foreground mb-1.5 sm:mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              placeholder="you@example.com"
            />
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-foreground mb-1.5 sm:mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-11 sm:pr-12 text-sm sm:text-base border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none transition-colors touch-manipulation"
              >
                {showPassword ? (
                  <EyeOff size={18} className="sm:w-5 sm:h-5" />
                ) : (
                  <Eye size={18} className="sm:w-5 sm:h-5" />
                )}
              </button>
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground">
              Must be at least 8 characters
            </p>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-foreground mb-1.5 sm:mb-2"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-11 sm:pr-12 text-sm sm:text-base border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none transition-colors touch-manipulation"
              >
                {showConfirmPassword ? (
                  <EyeOff size={18} className="sm:w-5 sm:h-5" />
                ) : (
                  <Eye size={18} className="sm:w-5 sm:h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-primary hover:bg-primary/90 disabled:bg-muted disabled:cursor-not-allowed text-primary-foreground font-semibold py-2.5 sm:py-3 text-sm sm:text-base rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 mt-5 sm:mt-6 touch-manipulation"
          >
            {isPending ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-4 w-4 sm:h-5 sm:w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating Account...
              </span>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <p className="mt-5 sm:mt-6 text-center text-xs sm:text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
