"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/app/lib/supabase/client";
import { Sparkles, ShieldCheck, Clock, Globe } from "lucide-react";

const roleRoutes: Record<string, string> = {
  patient: "/patient/dashboard",
  doctor: "/doctor/dashboard",
  admin: "/admin/dashboard",
};

const highlights = [
  { icon: ShieldCheck, text: "Encrypted health records" },
  { icon: Clock, text: "24/7 coordinator access" },
  { icon: Globe, text: "Care in 15+ countries" },
];

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
    <section className="relative min-h-[calc(100vh-64px)] bg-warm-white bg-dot-pattern py-12 lg:py-0">
      <div className="mx-auto grid min-h-[calc(100vh-64px)] max-w-7xl lg:grid-cols-2">
        <div className="relative hidden bg-navy lg:block">
          <Image
            src="https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&q=80&w=1200"
            alt="Doctor reviewing patient records"
            fill
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/70 to-navy/30" />
          <div className="absolute inset-0 flex flex-col justify-between p-12 text-white">
            <div className="font-heading text-xl font-semibold">Dadashri Vishwa Healthcare</div>
            <div className="max-w-md">
              <p className="font-heading text-3xl font-semibold leading-snug">
                Your health journey, supported at every step.
              </p>
              <p className="mt-4 text-white/80">
                Sign in to view your case, appointments, treatment plan and travel details — all in one secure place.
              </p>
              <div className="mt-8 space-y-4">
                {highlights.map((h, i) => (
                  <div key={h.text} className="flex items-center gap-3 animate-fade-up" style={{ animationDelay: `${i * 120}ms`, opacity: 0 }}>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
                      <h.icon className="h-5 w-5 text-teal" />
                    </div>
                    <span className="text-sm font-medium">{h.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center px-6 py-12 lg:px-16">
          <div className="w-full max-w-md animate-scale-in rounded-3xl bg-white p-8 shadow-xl ring-1 ring-navy/5">
            <div className="mb-8 text-center lg:text-left">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-sage text-teal lg:mx-0">
                <Sparkles className="h-6 w-6" />
              </div>
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
              <p className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
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
                  className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none transition-all focus:border-teal focus:ring-2 focus:ring-teal/20"
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
                  className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none transition-all focus:border-teal focus:ring-2 focus:ring-teal/20"
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
                className="w-full rounded-xl bg-navy py-3.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-teal disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-muted lg:text-left">
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
  );
}
