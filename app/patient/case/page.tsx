"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/app/lib/supabase/client";
import { submitCase } from "./actions";

const categories = [
  "Cardiology",
  "Cancer Care",
  "Orthopedics",
  "Neurology",
  "Organ Transplant",
  "Women's Health",
  "Dental",
  "Wellness Checkup",
];

export default function PatientCasePage() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await submitCase(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError("Case created. Please sign in to continue.");
      setSubmitted(true);
      setLoading(false);
      return;
    }

    router.push("/patient/dashboard");
    router.refresh();
  }

  if (submitted) {
    return (
      <section className="bg-warm-white py-16 lg:py-24">
        <div className="mx-auto max-w-2xl px-6 text-center lg:px-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sage">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0F766E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
          <h1 className="mt-6 font-heading text-3xl font-semibold text-navy">Case received</h1>
          <p className="mt-3 text-muted">
            Thank you for sharing your case. A care coordinator will review your details and reach out within 24 hours with a medical opinion and estimated treatment plan.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link href="/patient/dashboard" className="rounded-md bg-navy px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal">
              Go to dashboard
            </Link>
            <Link href="/doctors" className="rounded-md border border-border bg-white px-6 py-2.5 text-sm font-medium text-dark transition-colors hover:border-navy">
              Browse doctors
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-warm-white py-10 lg:py-16">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <Link href="/patient/dashboard" className="text-sm text-muted hover:text-teal">
          ← Back to dashboard
        </Link>

        <h1 className="mt-6 font-heading text-3xl font-semibold text-navy md:text-4xl">
          Share your case
        </h1>
        <p className="mt-2 text-muted">
          Tell us about your condition. Your information is encrypted and only shared with your assigned medical team.
        </p>

        {error && (
          <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6 rounded-lg border border-border bg-white p-6 shadow-sm lg:p-8">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-dark">Full name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="mt-2 w-full rounded-md border border-border bg-warm-white px-4 py-2.5 text-sm text-dark outline-none focus:border-teal"
                placeholder="Sarah Johnson"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-dark">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-2 w-full rounded-md border border-border bg-warm-white px-4 py-2.5 text-sm text-dark outline-none focus:border-teal"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-dark">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                className="mt-2 w-full rounded-md border border-border bg-warm-white px-4 py-2.5 text-sm text-dark outline-none focus:border-teal"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-dark">Phone</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className="mt-2 w-full rounded-md border border-border bg-warm-white px-4 py-2.5 text-sm text-dark outline-none focus:border-teal"
                placeholder="+1 555 123 4567"
              />
            </div>
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-dark">Your country</label>
              <input
                id="country"
                name="country"
                type="text"
                required
                className="mt-2 w-full rounded-md border border-border bg-warm-white px-4 py-2.5 text-sm text-dark outline-none focus:border-teal"
                placeholder="USA"
              />
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-dark">Preferred city in India</label>
              <input
                id="city"
                name="city"
                type="text"
                className="mt-2 w-full rounded-md border border-border bg-warm-white px-4 py-2.5 text-sm text-dark outline-none focus:border-teal"
                placeholder="Chennai"
              />
            </div>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-dark">Treatment category</label>
            <select
              id="category"
              name="category"
              required
              className="mt-2 w-full rounded-md border border-border bg-warm-white px-4 py-2.5 text-sm text-dark outline-none focus:border-teal"
            >
              <option value="">Select a category</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="condition" className="block text-sm font-medium text-dark">Describe your condition</label>
            <textarea
              id="condition"
              name="condition"
              placeholder="Symptoms, diagnosis, duration, current medications..."
              rows={5}
              required
              className="mt-2 w-full rounded-md border border-border bg-warm-white px-4 py-3 text-sm text-dark outline-none focus:border-teal"
            />
          </div>

          <div>
            <label htmlFor="previousTreatment" className="block text-sm font-medium text-dark">Previous treatment (optional)</label>
            <textarea
              id="previousTreatment"
              name="previousTreatment"
              placeholder="Surgeries, therapies, medications already tried..."
              rows={3}
              className="mt-2 w-full rounded-md border border-border bg-warm-white px-4 py-3 text-sm text-dark outline-none focus:border-teal"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-navy px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-teal disabled:opacity-60 sm:w-auto"
          >
            {loading ? "Submitting..." : "Submit case for review"}
          </button>
        </form>
      </div>
    </section>
  );
}
