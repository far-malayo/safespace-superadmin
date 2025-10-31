"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.message || "Login failed");
        setLoading(false);
        return;
      }

      // ✅ Store JWT token (sent from backend)
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      // ✅ Optional: store user role for quick access
      if (data.role) {
        localStorage.setItem("role", data.role);
      }

      // ✅ Redirect based on role or default to dashboard
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-center bg-cover"
      style={{ backgroundImage: "url('/images/admin-bg.png')" }}
    >
      <main className="w-full max-w-sm p-8 bg-white rounded-2xl shadow-2xl">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 relative mt-1 mb-3">
            <Image
              src="/images/ss-admin-logo.png"
              alt="logo"
              fill
              className="object-contain"
            />
          </div>

          <h1 className="text-xl font-bold text-gray-900">Super Admin</h1>
          <p className="text-xs text-gray-500 mb-6">
            System administration sign up portal
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1 text-gray-600">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-red-300 px-3 py-2 placeholder-gray-400 focus:outline-none"
              placeholder="you@school.edu.ph"
            />
          </div>

          <div className="relative">
            <label className="block text-xs font-medium mb-1 text-gray-600">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-gray-200 px-3 py-2 placeholder-gray-400 focus:outline-none"
              placeholder="Password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-2 top-8 text-gray-400"
              aria-label="Toggle password visibility"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-md text-white font-semibold bg-linear-to-r from-pink-600 to-indigo-700 shadow"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </main>
    </div>
  );
}
