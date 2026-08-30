"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/app/lib/supabase/client";
import { signUp } from "./actions";
import { HeartPulse, Stethoscope, Plane, ClipboardCheck } from "lucide-react";

const benefits = [
  { icon: HeartPulse, text: "Free initial medical review" },
  { icon: Stethoscope, text: "Verified doctors & hospitals" },
  { icon: Plane, text: "Visa & travel coordination" },
  { icon: ClipboardCheck, text: "Transparent treatment plans" },
];

const roleRoutes: Record<string, string> = {
  patient: "/patient/dashboard",
  doctor: "/doctor/dashboard",
  admin: "/admin/dashboard",
};

export default function SignUpPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: "",
    city: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const update = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    const fd = new FormData();
    Object.entries(form).forEach(([key, value]) => fd.append(key, value));

    const result = await signUp(fd);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    if (signInError || !data.user) {
      setError("Account created, but automatic sign-in failed. Please log in.");
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
    <section className="relative min-h-[calc(100vh-64px)] bg-warm-white py-12 lg:py-0">
      <div className="mx-auto grid min-h-[calc(100vh-64px)] max-w-7xl lg:grid-cols-2">
        <div className="relative hidden bg-navy lg:block">
          <Image
            src="https://images.unsplash.com/photo-1576091160403-2204935c1fd6?auto=format&fit=crop&q=80&w=1200"
            alt="Patient and care coordinator reviewing options"
            fill
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/70 to-navy/30" />
          <div className="absolute inset-0 flex flex-col justify-between p-12 text-white">
            <div className="font-heading text-xl font-semibold">Dadashri Vishwa Healthcare</div>
            <div className="max-w-md">
              <p className="font-heading text-3xl font-semibold leading-snug">
                Begin your care journey today.
              </p>
              <p className="mt-4 text-white/80">
                Create your secure account and get a dedicated coordinator, a personalized treatment plan, and direct access to verified doctors.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4">
                {benefits.map((b) => (
                  <div key={b.text} className="flex items-center gap-3 rounded-xl bg-white/10 p-3">
                    <b.icon className="h-5 w-5 text-teal" />
                    <span className="text-sm font-medium">{b.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center px-6 py-12 lg:px-16">
          <div className="w-full max-w-md animate-scale-in">
            <div className="mb-8 text-center lg:text-left">
              <p className="text-sm font-semibold uppercase tracking-widest text-teal">New patient</p>
              <h1 className="mt-2 font-heading text-2xl font-semibold text-navy md:text-3xl">
                Create your account
              </h1>
              <p className="mt-2 text-sm text-muted">
                Sign up to share your case, get a treatment plan, and manage your care in one secure place.
              </p>
            </div>

            {error && (
              <p className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-dark">
                  Full name
                </label>
                <input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  required
                  className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none transition-all focus:border-teal focus:ring-2 focus:ring-teal/20"
                  placeholder="Sarah Johnson"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-dark">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  required
                  className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none transition-all focus:border-teal focus:ring-2 focus:ring-teal/20"
                  placeholder="you@example.com"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-dark">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={form.password}
                    onChange={(e) => update("password", e.target.value)}
                    required
                    minLength={6}
                    className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none transition-all focus:border-teal focus:ring-2 focus:ring-teal/20"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-dark">
                    Confirm password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={form.confirmPassword}
                    onChange={(e) => update("confirmPassword", e.target.value)}
                    required
                    minLength={6}
                    className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none transition-all focus:border-teal focus:ring-2 focus:ring-teal/20"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-dark">
                    Your country
                  </label>
                  <input
                    id="country"
                    type="text"
                    value={form.country}
                    onChange={(e) => update("country", e.target.value)}
                    required
                    className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none transition-all focus:border-teal focus:ring-2 focus:ring-teal/20"
                    placeholder="USA"
                  />
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-dark">
                    Preferred city in India
                  </label>
                  <input
                    id="city"
                    type="text"
                    value={form.city}
                    onChange={(e) => update("city", e.target.value)}
                    className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none transition-all focus:border-teal focus:ring-2 focus:ring-teal/20"
                    placeholder="Chennai"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-navy py-3.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-teal disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Create account"}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-muted lg:text-left">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-teal hover:text-navy">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
