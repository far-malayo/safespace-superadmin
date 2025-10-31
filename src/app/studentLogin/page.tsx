"use client";

import { useState } from "react";

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Login failed");
        return;
      }

      console.log("✅ Login success:", data);
      alert("Login successful!");
      // TODO: Redirect user to dashboard or protected page
    } catch (err) {
      console.error("❌ Login error:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6">
      <div className="max-w-6xl w-full h-screen bg-white rounded-3xl overflow-hidden shadow-xl grid grid-cols-1 md:grid-cols-2">
        {/* Right panel: form card (now first) */}
        <div className="flex items-center justify-center p-8">
          <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
            <div className="mb-10">
              <img
                src="/images/SafeSpace_logo.png"
                alt="SafeSpace"
                className="h-12 w-auto mb-4 object-contain"
              />
            </div>
            <div className="text-left mb-10">
              <h1 className="text-2xl font-bold text-gray-800">Sign In</h1>
              <p className="mt-1 text-sm text-gray-500">
                Please login to continue to your account.
              </p>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-600">
                Webmail<span className="ml-0.5 text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="email@iskolarngbayan.pup.edu.ph"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-pink-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-gray-600">
                Password<span className="ml-0.5 text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-pink-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-500"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-t from-[#a52163] to-[#1c167b] shadow-sm hover:opacity-95 transition"
            >
              Sign in
            </button>

            <p className="text-center text-sm text-gray-500">
              Need an account?{" "}
              <a href="/signup" className="text-pink-600 hover:underline">
                Create one
              </a>
            </p>
          </form>
        </div>

        {/* Left panel with gradient and branding (now second) */}
        <div
          className="hidden md:flex items-center justify-center relative bg-linear-to-br from-purple-900 via-indigo-900 to-pink-700 p-12 bg-center bg-cover"
          style={{ backgroundImage: "url('/images/signup_background.png')" }}
        >
          <div className="absolute inset-0 bg-black/40" aria-hidden />

          <div
            className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-120 h-120 z-0"
            aria-hidden
            style={{
              mixBlendMode: "saturation",
              opacity: 1,
            }}
          >
            <img
              src="/images/osc_logo.png"
              alt=""
              className="w-full h-full object-contain"
              style={{ opacity: 1 }}
            />
          </div>

          <div className="relative z-10 text-center text-white max-w-xs space-y-2">
            <div className="mx-auto w-20 h-18 rounded-full flex items-center justify-center overflow-hidden">
              <img
                src="/images/STRAW_logo.png"
                alt="Brand"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mx-auto w-80 h-17 flex items-center justify-center overflow-hidden">
              <img
                src="/images/SafeSpace_signup_logo.png"
                alt="Second Brand"
                className="w-full h-full object-cover"
              />
            </div>

            <p className="text-sm text-white/80">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <div>
              <p className="mt-15 text-xs uppercase tracking-wider text-white font-bold italic">
                United Voices, Shaping Futures
              </p>
              <p className=" text-xs tracking-wider text-white/80">
                Tungo sa Makamasang Lipunan
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
