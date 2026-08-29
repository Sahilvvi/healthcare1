"use client";

import { useState } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.name && form.email && form.message) {
      setSubmitted(true);
    }
  }

  return (
    <section className="bg-warm-white py-16 lg:py-24">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-teal">
              Contact
            </p>
            <h1 className="mt-3 font-heading text-3xl font-semibold text-navy md:text-4xl">
              We are here to help
            </h1>
            <p className="mt-4 text-muted">
              Have a question about treatment, travel or your case? Reach out
              and a care coordinator will respond within one business day.
            </p>

            <div className="mt-8 space-y-4 text-sm">
              <div>
                <p className="text-muted">Email</p>
                <p className="font-medium text-dark">care@dadashrihealth.com</p>
              </div>
              <div>
                <p className="text-muted">Phone</p>
                <p className="font-medium text-dark">+91 80 1234 5678</p>
              </div>
              <div>
                <p className="text-muted">Hours</p>
                <p className="font-medium text-dark">
                  Monday – Saturday, 9:00 AM – 7:00 PM IST
                </p>
              </div>
            </div>
          </div>

          {submitted ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-white p-6 text-center lg:p-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sage">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#0F766E"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
              <h2 className="mt-4 font-heading text-xl font-semibold text-navy">
                Message sent
              </h2>
              <p className="mt-2 text-sm text-muted">
                Thank you {form.name}. A care coordinator will reach out to{" "}
                {form.email} within one business day.
              </p>
            </div>
          ) : (
            <form
              className="rounded-lg border border-border bg-white p-6 lg:p-8"
              onSubmit={handleSubmit}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark">
                    Name
                  </label>
                  <input
                    value={form.name}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    required
                    className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-teal"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark">
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, email: e.target.value }))
                    }
                    required
                    className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-teal"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, message: e.target.value }))
                    }
                    required
                    className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-teal"
                    placeholder="How can we help you?"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-md bg-navy py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal"
                >
                  Send message
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
