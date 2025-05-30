// /frontend/app/register/page.js
"use client";
import { useState } from "react";
// import { useRouter } from "next/navigation"; // Original import - causes error if "next/navigation" is not resolvable
// import Link from "next/link"; // Original import - causes error if "next/link" is not resolvable

// --- Mock Implementations for useRouter and Link ---
// These mocks are used to allow the component to compile and run in environments
// where Next.js specific modules might not be available or resolvable.
// In a full Next.js environment, the actual Next.js modules would be used.

const useRouter = () => {
  console.warn(
    "[MOCK] useRouter hook is being used. Actual Next.js navigation will not occur in this environment.",
  );
  return {
    push: (path) => {
      console.log(`[MOCK] router.push: Navigating to ${path}`);
      // For basic behavior in a non-Next.js environment, use window.location
      window.location.href = path;
    },
    replace: (path) => {
      console.log(`[MOCK] router.replace: Replacing with ${path}`);
      window.location.replace(path);
    },
    back: () => {
      console.log("[MOCK] router.back: Navigating back.");
      window.history.back();
    },
    prefetch: (href) => {
      console.log(`[MOCK] router.prefetch: Prefetching ${href}`);
    },
    refresh: () => {
      console.log("[MOCK] router.refresh: Refreshing current route.");
      window.location.reload();
    },
    // Add any other router methods your component might use
  };
};

const Link = ({ href, children, ...props }) => {
  console.warn(
    `[MOCK] Link component is being used for href="${href}". Using a basic <a> tag with window.location navigation.`,
  );
  return (
    <a
      href={href}
      onClick={(e) => {
        e.preventDefault(); // Prevent default anchor tag behavior
        console.log(
          `[MOCK] Link clicked for href="${href}". Navigating with window.location.href.`,
        );
        window.location.href = href;
      }}
      {...props}
    >
      {children}
    </a>
  );
};
// --- End Mock Implementations ---

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", content: "" }); // For success/error messages
  const router = useRouter(); // Now uses the mock useRouter

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [id]: value }));
    // Clear message when user starts typing again
    if (message.content) {
      setMessage({ type: "", content: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: "", content: "" }); // Clear previous messages

    // Basic client-side validation (can be expanded)
    if (!form.name || !form.email || !form.password) {
      setMessage({ type: "error", content: "All fields are required." });
      setIsLoading(false);
      return;
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setMessage({
        type: "error",
        content: "Please enter a valid email address.",
      });
      setIsLoading(false);
      return;
    }
    if (form.password.length < 6) {
      setMessage({
        type: "error",
        content: "Password must be at least 6 characters long.",
      });
      setIsLoading(false);
      return;
    }

    try {
      // Ensure your environment variable is named NEXT_PUBLIC_API_BASE_URL in your .env.local file
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      if (!apiUrl) {
        console.error(
          "API base URL is not defined. Make sure NEXT_PUBLIC_API_BASE_URL is set.",
        );
        setMessage({
          type: "error",
          content: "Configuration error. Please contact support.",
        });
        setIsLoading(false);
        return;
      }

      const res = await fetch(`${apiUrl}/api/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      let data;
      try {
        // Try to parse the response as JSON
        data = await res.json();
      } catch (parseError) {
        // Handle cases where response isn't valid JSON (e.g., server error HTML page)
        console.error("Error parsing JSON response:", parseError);
        if (res.ok) {
          // This case is unlikely if parsing failed but res.ok is true, but handle defensively
          setMessage({
            type: "success",
            content:
              "Registration successful (but response format was unexpected).",
          });
          router.push("/login"); // Uses mock router.push
        } else {
          setMessage({
            type: "error",
            content: `Registration failed. Status: ${res.status}. Please try again.`,
          });
        }
        setIsLoading(false);
        return;
      }

      if (res.ok) {
        // Prioritize backend message for success, even if it's an empty string. Fallback if message is null/undefined.
        const successMessageToShow =
          data && data.message != null
            ? data.message
            : "Registration successful! Redirecting to login...";
        setMessage({ type: "success", content: successMessageToShow });
        // Optionally clear the form
        setForm({ name: "", email: "", password: "" });
        setTimeout(() => {
          router.push("/login"); // Uses mock router.push
        }, 2000); // Redirect after a short delay to show success message
      } else {
        // Prioritize backend error message (data.message or data.error). Fallback if null/undefined.
        let errorMessageToShow;
        if (data && data.message != null) {
          errorMessageToShow = data.message;
        } else if (data && data.error != null) {
          errorMessageToShow = data.error;
        } else {
          errorMessageToShow = `Registration failed (Status: ${res.status}). Please try again.`;
        }
        setMessage({ type: "error", content: errorMessageToShow });
      }
    } catch (networkError) {
      // Handles fetch failing entirely (e.g. network issue, CORS, DNS)
      console.error("Network or fetch error:", networkError);
      setMessage({
        type: "error",
        content:
          "Registration failed due to a network issue. Please check your connection and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8 font-inter">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Create Account
          </h1>
          <p className="text-sm text-gray-500">
            Join us and start your journey!
          </p>
        </div>

        {/* Message display area */}
        {message.content && (
          <div
            className={`p-3 rounded-lg text-sm text-center ${
              message.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message.content}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={form.name}
              required
              className="mt-1 w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-400"
              onChange={handleChange}
              placeholder="John Doe"
              disabled={isLoading}
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              required
              className="mt-1 w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-400"
              onChange={handleChange}
              placeholder="you@example.com"
              disabled={isLoading}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={form.password}
              required
              className="mt-1 w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-400"
              onChange={handleChange}
              placeholder="••••••••"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 text-white font-semibold py-2.5 px-4 rounded-lg transition duration-200 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                Registering...
              </>
            ) : (
              "Register"
            )}
          </button>
        </form>
        <p className="mt-6 text-sm text-center text-gray-500">
          Already have an account? {/* Now uses the mock Link component */}
          <Link
            href="/login"
            className="font-medium text-blue-600 hover:text-blue-500 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
