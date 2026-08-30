"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/app/lib/supabase/client";
import { ArrowLeft, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<{ ok?: boolean; message?: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);
    if (error) {
      const msg =
        error.message?.toLowerCase().includes("email_address_invalid") ||
        error.message?.toLowerCase().includes("is invalid")
          ? "Please use a real, deliverable email address. Test/example domains are rejected."
          : error.message;
      setStatus({ ok: false, message: msg });
    } else {
      setStatus({ ok: true, message: "If this account exists, a reset link has been sent to your inbox." });
      setEmail("");
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
            <Mail className="h-6 w-6" />
          </div>
          <h1 className="font-heading text-2xl font-semibold text-navy">Reset your password</h1>
          <p className="mt-2 text-sm text-muted">
            Enter your email and we&apos;ll send you a secure link to set a new password.
          </p>
        </div>

        {status?.message && (
          <p className={`mb-6 rounded-xl px-4 py-3 text-sm ${status.ok ? "bg-teal/10 text-teal" : "bg-red-50 text-red-700"}`}>
            {status.message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-dark">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none transition-all focus:border-teal focus:ring-2 focus:ring-teal/20"
              placeholder="you@example.com"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-navy py-3.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-teal disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>
      </div>
    </section>
  );
}
