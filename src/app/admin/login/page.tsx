"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push("/admin");
  };

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background p-8">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm rounded-xl border border-border bg-surface p-8"
      >
        <h1 className="font-heading text-2xl text-primary">Admin Login</h1>
        <p className="mt-1 text-sm text-secondary">Sign in to manage your portfolio</p>

        <div className="mt-6 flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="text-sm text-secondary">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-3 text-primary placeholder:text-muted focus:border-accent-secondary focus:outline-none"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm text-secondary">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-3 text-primary placeholder:text-muted focus:border-accent-secondary focus:outline-none"
              placeholder="Enter password"
            />
          </div>
        </div>

        {error && <p className="mt-3 text-sm text-danger">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full cursor-pointer rounded-lg bg-accent px-6 py-3 font-body text-background transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </main>
  );
}
