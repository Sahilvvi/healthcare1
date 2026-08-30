"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/app/lib/supabase/client";
import { TrustSection } from "@/app/components/TrustSection";
import { FAQSection } from "@/app/components/FAQSection";
import { FinalCTA } from "@/app/components/FinalCTA";
import { Reveal } from "@/app/components/Reveal";

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
    <>
      <section className="bg-warm-white py-12 lg:py-20">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm lg:grid lg:grid-cols-2">
            <div className="relative h-72 lg:h-auto lg:min-h-[600px]">
              <Image
                src="https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&q=80&w=1200"
                alt="Medical team consultation"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-navy/70" />
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white lg:p-10">
                <h2 className="font-heading text-2xl font-semibold lg:text-3xl">
                  Your health journey, supported at every step.
                </h2>
                <p className="mt-4 max-w-md text-white/80">
                  Sign in to view your case, appointments, treatment plan and
                  travel details — all in one secure place.
                </p>
                <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckIcon />
                    <span>Encrypted records</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckIcon />
                    <span>Live coordination</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckIcon />
                    <span>Medical history</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckIcon />
                    <span>Video consultations</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 lg:p-12">
              <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-widest text-teal">
                  Patient / Doctor / Admin portal
                </p>
                <h1 className="mt-2 font-heading text-2xl font-semibold text-navy md:text-3xl">
                  Welcome back
                </h1>
                <p className="mt-2 text-sm text-muted">
                  Sign in to your Dadashri Vishwa Healthcare account.
                </p>
              </div>

              {error && (
                <p className="mb-6 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </p>
              )}

              <form className="space-y-5" onSubmit={handleSubmit}>
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
                    className="mt-2 w-full rounded-md border border-border bg-warm-white px-4 py-3 text-sm outline-none transition-colors focus:border-teal focus:ring-1 focus:ring-teal"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-dark">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="mt-2 w-full rounded-md border border-border bg-warm-white px-4 py-3 text-sm outline-none transition-colors focus:border-teal focus:ring-1 focus:ring-teal"
                    placeholder="••••••••"
                  />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-muted">
                    <input type="checkbox" className="rounded border-border text-teal focus:ring-teal" />
                    Remember me
                  </label>
                  <Link href="#" className="text-teal hover:text-navy">
                    Forgot password?
                  </Link>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-md bg-navy py-3 text-sm font-medium text-white transition-colors hover:bg-teal disabled:opacity-60"
                >
                  {loading ? "Signing in..." : "Sign in"}
                </button>
              </form>

              <p className="mt-8 text-center text-sm text-muted">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="font-medium text-teal hover:text-navy">
                  Create an account
                </Link>{" "}
                or{" "}
                <Link href="/patient/case" className="font-medium text-teal hover:text-navy">
                  share your case
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      <Reveal>
        <TrustSection />
      </Reveal>
      <Reveal delay={100}>
        <FAQSection />
      </Reveal>
      <FinalCTA />
    </>
  );
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
