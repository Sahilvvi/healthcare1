"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/app/lib/supabase/client";

const roleRoutes: Record<string, string> = {
  patient: "/patient/dashboard",
  doctor: "/doctor/dashboard",
  admin: "/admin/dashboard",
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError || !data.user) {
      setError(signInError?.message ?? "Invalid credentials");
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from("dv_profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    const role = profile?.role ?? "patient";
    router.push(roleRoutes[role] ?? "/patient/dashboard");
    router.refresh();
  };

  return (
    <section className="bg-warm-white py-16 lg:py-24">
      <div className="mx-auto max-w-md px-6 lg:px-8">
        <div className="rounded-lg border border-border bg-white p-8 shadow-sm">
          <h1 className="font-heading text-2xl font-semibold text-navy">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-muted">
            Sign in to your Dadashri Vishwa Healthcare account.
          </p>

          {error && (
            <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-dark">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-teal"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-teal"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-navy py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            Don&apos;t have an account?{" "}
            <Link href="/treatment-plan" className="text-teal hover:text-navy">
              Start your treatment plan
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
