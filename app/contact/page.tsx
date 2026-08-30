"use client";

import { useState } from "react";
import Image from "next/image";
import { submitContact } from "./actions";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<{ ok?: boolean; error?: string } | null>(null);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;

    setStatus(null);
    setLoading(true);
    const result = await submitContact(new FormData(e.currentTarget as HTMLFormElement));
    setLoading(false);

    if (result.error) {
      setStatus(result);
      return;
    }

    setStatus(result);
    setSubmitted(true);
  }

  return (
    <section className="bg-warm-white py-12 lg:py-20">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm lg:grid lg:grid-cols-2">
          <div className="relative h-72 lg:h-auto lg:min-h-[600px]">
            <Image
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1200"
              alt="Healthcare coordinator on a call"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-navy/60" />
            <div className="absolute inset-0 flex flex-col justify-end p-6 text-white lg:p-10">
              <h2 className="font-heading text-2xl font-semibold lg:text-3xl">We are here to help</h2>
              <p className="mt-4 max-w-md text-white/80">
                Have a question about treatment, travel or your case? A care coordinator will respond within one business day.
              </p>
              <div className="mt-8 space-y-4 text-sm">
                <div className="flex items-center gap-3">
                  <EmailIcon />
                  <span>care@dadashrihealth.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <PhoneIcon />
                  <span>+91 80 1234 5678</span>
                </div>
                <div className="flex items-center gap-3">
                  <ClockIcon />
                  <span>Monday – Saturday, 9:00 AM – 7:00 PM IST</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 lg:p-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-teal">Contact us</p>
            <h1 className="mt-2 font-heading text-2xl font-semibold text-navy md:text-3xl">
              Send a message
            </h1>
            <p className="mt-2 text-sm text-muted">
              Fill in the form and a care coordinator will get back to you.
            </p>

            {submitted ? (
              <div className="mt-8 flex flex-col items-center justify-center rounded-lg border border-border bg-warm-white p-8 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sage">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0F766E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </div>
                <h2 className="mt-4 font-heading text-xl font-semibold text-navy">Message sent</h2>
                <p className="mt-2 text-sm text-muted">
                  Thank you {form.name}. A care coordinator will reach out to{" "}
                  {form.email} within one business day.
                </p>
              </div>
            ) : (
              <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                {status?.error && (
                  <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
                    {status.error}
                  </p>
                )}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-dark">Name</label>
                  <input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                    required
                    className="mt-2 w-full rounded-md border border-border bg-warm-white px-4 py-3 text-sm outline-none transition-colors focus:border-teal focus:ring-1 focus:ring-teal"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-dark">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                    required
                    className="mt-2 w-full rounded-md border border-border bg-warm-white px-4 py-3 text-sm outline-none transition-colors focus:border-teal focus:ring-1 focus:ring-teal"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-dark">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                    required
                    className="mt-2 w-full rounded-md border border-border bg-warm-white px-4 py-3 text-sm outline-none transition-colors focus:border-teal focus:ring-1 focus:ring-teal"
                    placeholder="How can we help you?"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-md bg-navy py-3 text-sm font-medium text-white transition-colors hover:bg-teal disabled:opacity-60"
                >
                  {loading ? "Sending..." : "Send message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function EmailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}
