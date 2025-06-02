// /frontend/app/login/page.js
"use client";
import { useState } from "react";

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

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", content: "" });
  const router = useRouter(); // Uses mock router

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [id]: value }));
    if (message.content) {
      setMessage({ type: "", content: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: "", content: "" });

    if (!form.email || !form.password) {
      setMessage({
        type: "error",
        content: "Both email and password are required.",
      });
      setIsLoading(false);
      return;
    }

    try {
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

      const res = await fetch(`${apiUrl}/api/user/login`, {
        // Using environment variable for API URL
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      let data;
      try {
        data = await res.json();
      } catch (parseError) {
        console.error("Error parsing JSON response:", parseError);
        setMessage({
          type: "error",
          content: `Login failed. Status: ${res.status}. Please try again.`,
        });
        setIsLoading(false);
        return;
      }

      if (res.ok) {
        const successMessageToShow =
          data && data.message != null
            ? data.message
            : "Login successful! Redirecting...";
        setMessage({ type: "success", content: successMessageToShow });

        if (data && data.token) {
          localStorage.setItem("token", data.token); // Store token
          localStorage.setItem("name", data.name);
          localStorage.setItem("email", data.email);

          console.log("Token stored in localStorage.");
        } else {
          console.warn("No token received from backend upon login.");
        }

        setForm({ email: "", password: "" }); // Clear form
        setTimeout(() => {
          router.push("/dashboard"); // Redirect to dashboard or desired page
        }, 1500);
      } else {
        let errorMessageToShow;
        if (data && data.message != null) {
          errorMessageToShow = data.message;
        } else if (data && data.error != null) {
          errorMessageToShow = data.error;
        } else {
          errorMessageToShow = `Login failed (Status: ${res.status}). Please check your credentials.`;
        }
        setMessage({ type: "error", content: errorMessageToShow });
      }
    } catch (networkError) {
      console.error("Login network error:", networkError);
      setMessage({
        type: "error",
        content:
          "Login failed due to a network issue. Please check your connection.",
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
            Welcome Back
          </h1>
          <p className="text-sm text-gray-500">
            Please enter your login details.
          </p>
        </div>

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
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>
        <p className="mt-6 text-sm text-center text-gray-500">
          Don’t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-blue-600 hover:text-blue-500 hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
