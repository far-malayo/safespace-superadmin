import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      <main className="text-center space-y-8 px-6 py-12 max-w-lg">
        <h1 className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
          Welcome to SafeSpace 💬
        </h1>

        <p className="text-gray-600 dark:text-gray-300 text-lg">
          A secure and confidential grievance reporting platform.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <Link
            href="/studentLogin"
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-full transition"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="w-full sm:w-auto border border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900 font-semibold py-3 px-8 rounded-full transition"
          >
            Sign Up
          </Link>
        </div>

        <footer className="pt-8 text-sm text-gray-400 dark:text-gray-500">
          © {new Date().getFullYear()} SafeSpace. All rights reserved.
        </footer>
      </main>
    </div>
  );
}
