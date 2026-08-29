"use client";

import { useState } from "react";
import Link from "next/link";

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
  const [form, setForm] = useState({
    category: "",
    condition: "",
    previousTreatment: "",
    reports: null as FileList | null,
    city: "",
    country: "",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.category && form.condition && form.country) {
      setSubmitted(true);
    }
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
          Tell us about your condition and upload any medical reports. Your information is encrypted and only shared with your assigned medical team.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6 rounded-lg border border-border bg-white p-6 shadow-sm lg:p-8">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-dark">Treatment category</label>
            <select
              id="category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="mt-2 w-full rounded-md border border-border bg-warm-white px-4 py-2.5 text-sm text-dark outline-none focus:border-teal focus:ring-1 focus:ring-teal"
              required
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
              value={form.condition}
              onChange={(e) => setForm({ ...form, condition: e.target.value })}
              placeholder="Symptoms, diagnosis, duration, current medications..."
              rows={5}
              required
              className="mt-2 w-full rounded-md border border-border bg-warm-white px-4 py-3 text-sm text-dark outline-none focus:border-teal focus:ring-1 focus:ring-teal"
            />
          </div>

          <div>
            <label htmlFor="previous" className="block text-sm font-medium text-dark">Previous treatment (optional)</label>
            <textarea
              id="previous"
              value={form.previousTreatment}
              onChange={(e) => setForm({ ...form, previousTreatment: e.target.value })}
              placeholder="Surgeries, therapies, medications already tried..."
              rows={3}
              className="mt-2 w-full rounded-md border border-border bg-warm-white px-4 py-3 text-sm text-dark outline-none focus:border-teal focus:ring-1 focus:ring-teal"
            />
          </div>

          <div>
            <label htmlFor="reports" className="block text-sm font-medium text-dark">Upload reports (optional)</label>
            <input
              id="reports"
              type="file"
              multiple
              onChange={(e) => setForm({ ...form, reports: e.target.files })}
              className="mt-2 block w-full rounded-md border border-border bg-warm-white px-4 py-3 text-sm text-dark file:mr-4 file:rounded-md file:border-0 file:bg-navy file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-teal"
            />
            <p className="mt-2 text-xs text-muted">Supports PDF, JPG, PNG up to 10 MB each.</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-dark">Your country</label>
              <input
                id="country"
                type="text"
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                placeholder="USA"
                required
                className="mt-2 w-full rounded-md border border-border bg-warm-white px-4 py-2.5 text-sm text-dark outline-none focus:border-teal focus:ring-1 focus:ring-teal"
              />
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-dark">Preferred city in India (optional)</label>
              <input
                id="city"
                type="text"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="Chennai"
                className="mt-2 w-full rounded-md border border-border bg-warm-white px-4 py-2.5 text-sm text-dark outline-none focus:border-teal focus:ring-1 focus:ring-teal"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-navy px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-teal sm:w-auto"
          >
            Submit case for review
          </button>
        </form>
      </div>
    </section>
  );
}
