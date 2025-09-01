"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LogIn } from "lucide-react";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", content: "" });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    if (message.content) setMessage({ type: "", content: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setMessage({
        type: "error",
        content: "Both email and password are required.",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        },
      );
      const data = await res.json();

      if (res.ok) {
        setMessage({
          type: "success",
          content: data.message || "Login successful!",
        });
        ["token", "name", "email", "role"].forEach((key) =>
          localStorage.setItem(key, data[key]),
        );
        setTimeout(() => router.push("/dashboard"), 1500);
      } else {
        setMessage({
          type: "error",
          content: data.message || "Invalid credentials.",
        });
      }
    } catch {
      setMessage({
        type: "error",
        content: "Network error. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-slate-800/90 backdrop-blur-sm rounded-2xl p-8 space-y-6 shadow-2xl border border-slate-700/50"
      >
        <div className="text-center">
          <LogIn className="w-12 h-12 text-sky-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-400 to-cyan-400 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            Sign in to continue to your account
          </p>
        </div>

        {message.content && (
          <div
            className={`p-3 rounded-lg text-center text-sm ${
              message.type === "success"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "bg-red-500/20 text-red-400 border border-red-500/30"
            }`}
          >
            {message.content}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-300 mb-1"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="you@example.com"
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-300 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-sky-500 to-cyan-600 hover:from-sky-600 hover:to-cyan-700 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <LogIn size={18} />
          )}
          <span>{loading ? "Signing in..." : "Sign In"}</span>
        </button>

        <p className="text-center text-slate-400 text-sm">
          New here?{" "}
          <Link
            href="/register"
            className="text-sky-400 hover:text-sky-300 hover:underline font-medium"
          >
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
}
