// app/(auth)/forgot-password/page.tsx
"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import { adminConfig } from "@/config/admin-config";
import Image from "next/image";
import { forgotPasswordAction } from "@/lib/actions/auth";

export default function ForgotPasswordPage() {
  const [state, formAction, isPending] = useActionState(
    forgotPasswordAction,
    undefined,
  );

  const getInitial = (text: string) => {
    return text.charAt(0).toUpperCase();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 sm:px-6 lg:px-8">
      <div className="bg-card border border-border p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-md">
        {/* Logo Section */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-3">
            {adminConfig.header.logo.type === "image" &&
            adminConfig.header.logo.src ? (
              <>
                <Image
                  src={adminConfig.header.logo.src}
                  alt={adminConfig.header.logo.alt || "Logo"}
                  width={48}
                  height={48}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-contain"
                />
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                  {adminConfig.header.logo.text}
                </h2>
              </>
            ) : (
              <>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-xl sm:text-2xl">
                    {getInitial(adminConfig.header.logo.text || "A")}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                  {adminConfig.header.logo.text}
                </h2>
              </>
            )}
          </div>
        </div>

        {/* Back to Login Link */}
        <div className="mb-6">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} />
            Back to login
          </Link>
        </div>

        {!state?.success ? (
          <>
            {/* Header */}
            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                Forgot Password?
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Enter your email address and we'll send you a link to reset your
                password
              </p>
            </div>

            {/* Form Error */}
            {state?.error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive px-3 sm:px-4 py-2.5 sm:py-3 rounded-md mb-4 sm:mb-6 text-xs sm:text-sm">
                {state.error}
              </div>
            )}

            <form action={formAction} className="space-y-4 sm:space-y-5">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-foreground mb-1.5 sm:mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={18}
                  />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="w-full pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-primary hover:bg-primary/90 disabled:bg-muted disabled:cursor-not-allowed text-primary-foreground font-semibold py-2.5 sm:py-3 text-sm sm:text-base rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 touch-manipulation"
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
                    Sending...
                  </span>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>
          </>
        ) : (
          <>
            {/* Success Message */}
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                Check Your Email
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground mb-6">
                We've sent a password reset link to your email address. Please
                check your inbox and follow the instructions.
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground mb-8">
                Didn't receive the email? Check your spam folder or{" "}
                <Link
                  href="/forgot-password"
                  className="text-primary hover:text-primary/80 font-medium"
                >
                  try again
                </Link>
              </p>
              <Link
                href="/login"
                className="inline-flex items-center justify-center w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 sm:py-3 text-sm sm:text-base rounded-md transition-all"
              >
                <ArrowLeft size={16} className="mr-2" />
                Back to Login
              </Link>
            </div>
          </>
        )}

        {!state?.success && (
          <p className="mt-5 sm:mt-6 text-center text-xs sm:text-sm text-muted-foreground">
            Remember your password?{" "}
            <Link
              href="/login"
              className="font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Sign in
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
