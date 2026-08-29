"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/app/lib/supabase/client";
import { signUp } from "./actions";

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
    <section className="bg-warm-white py-12 lg:py-20">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm lg:grid lg:grid-cols-2">
          <div className="relative h-72 lg:h-auto lg:min-h-[600px]">
            <Image
              src="https://images.unsplash.com/photo-1576091160403-2204935c1fd6?auto=format&fit=crop&q=80&w=1200"
              alt="Patient and care coordinator reviewing options"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-navy/70" />
            <div className="absolute inset-0 flex flex-col justify-end p-6 text-white lg:p-10">
              <h2 className="font-heading text-2xl font-semibold lg:text-3xl">
                Begin your care journey.
              </h2>
              <p className="mt-4 max-w-md text-white/80">
                Create your secure account and get a dedicated coordinator, a
                personalized treatment plan, and direct access to verified doctors.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <CheckIcon />
                  <span>Free case review</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckIcon />
                  <span>Verified hospitals</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckIcon />
                  <span>Transparent pricing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckIcon />
                  <span>Travel coordination</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 lg:p-12">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-widest text-teal">
                New patient
              </p>
              <h1 className="mt-2 font-heading text-2xl font-semibold text-navy md:text-3xl">
                Create your account
              </h1>
              <p className="mt-2 text-sm text-muted">
                Sign up to share your case, get a treatment plan, and manage your
                care in one secure place.
              </p>
            </div>

            {error && (
              <p className="mb-6 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="name" className="block text-sm font-medium text-dark">
                    Full name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    required
                    className="mt-2 w-full rounded-md border border-border bg-warm-white px-4 py-3 text-sm outline-none transition-colors focus:border-teal focus:ring-1 focus:ring-teal"
                    placeholder="Sarah Johnson"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="email" className="block text-sm font-medium text-dark">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
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
                    value={form.password}
                    onChange={(e) => update("password", e.target.value)}
                    required
                    minLength={6}
                    className="mt-2 w-full rounded-md border border-border bg-warm-white px-4 py-3 text-sm outline-none transition-colors focus:border-teal focus:ring-1 focus:ring-teal"
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
                    className="mt-2 w-full rounded-md border border-border bg-warm-white px-4 py-3 text-sm outline-none transition-colors focus:border-teal focus:ring-1 focus:ring-teal"
                    placeholder="••••••••"
                  />
                </div>
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
                    className="mt-2 w-full rounded-md border border-border bg-warm-white px-4 py-3 text-sm outline-none transition-colors focus:border-teal focus:ring-1 focus:ring-teal"
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
                    className="mt-2 w-full rounded-md border border-border bg-warm-white px-4 py-3 text-sm outline-none transition-colors focus:border-teal focus:ring-1 focus:ring-teal"
                    placeholder="Chennai"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-navy py-3 text-sm font-medium text-white transition-colors hover:bg-teal disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Create account"}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-muted">
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

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
