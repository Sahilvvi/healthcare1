"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/app/lib/supabase/client";
import { Lock, ArrowLeft } from "lucide-react";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<{ ok?: boolean; message?: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    if (!code) return;
    const supabase = createClient();
    supabase.auth
      .exchangeCodeForSession(code)
      .then(({ error }) => {
        if (error) {
          setStatus({ ok: false, message: error.message });
        } else {
          setSessionReady(true);
        }
      });
  }, [code]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setStatus({ ok: false, message: "Passwords do not match." });
      return;
    }
    if (password.length < 6) {
      setStatus({ ok: false, message: "Password must be at least 6 characters." });
      return;
    }

    setLoading(true);
    setStatus(null);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    setLoading(false);
    if (error) {
      setStatus({ ok: false, message: error.message });
    } else {
      setStatus({ ok: true, message: "Password updated. Redirecting to login..." });
      setTimeout(() => router.push("/login"), 1500);
    }
  }

  return (
    <section className="relative flex min-h-[calc(100vh-64px)] items-center justify-center bg-warm-white px-6 py-12">
      <div className="w-full max-w-md animate-scale-in rounded-3xl bg-white p-8 shadow-xl ring-1 ring-navy/5">
        <Link href="/login" className="inline-flex items-center gap-2 text-sm text-muted hover:text-navy">
          <ArrowLeft className="h-4 w-4" /> Back to login
        </Link>
        <div className="mb-6 mt-4 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-sage text-teal">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="font-heading text-2xl font-semibold text-navy">Create a new password</h1>
        </div>

        {!code && (
          <p className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            Invalid or missing reset code. Please request a new reset link.
          </p>
        )}

        {status?.message && (
          <p className={`mb-6 rounded-xl px-4 py-3 text-sm ${status.ok ? "bg-teal/10 text-teal" : "bg-red-50 text-red-700"}`}>
            {status.message}
          </p>
        )}

        {code && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-dark">
                New password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none transition-all focus:border-teal focus:ring-2 focus:ring-teal/20"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label htmlFor="confirm" className="block text-sm font-medium text-dark">
                Confirm password
              </label>
              <input
                id="confirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                minLength={6}
                className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none transition-all focus:border-teal focus:ring-2 focus:ring-teal/20"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !sessionReady}
              className="w-full rounded-xl bg-navy py-3.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-teal disabled:opacity-60"
            >
              {loading ? "Updating..." : sessionReady ? "Update password" : "Verifying link..."}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
