"use client";

import { useState } from "react";
import Link from "next/link";

export default function PatientProfilePage() {
  const [form, setForm] = useState({
    name: "Sarah Thompson",
    email: "sarah.t@example.com",
    phone: "+1 415 555 0192",
    country: "United States",
    bloodGroup: "O+",
    allergies: "Penicillin",
  });
  const [saved, setSaved] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <section className="bg-warm-white py-10 lg:py-16">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <Link href="/patient/dashboard" className="text-sm text-muted hover:text-teal">
          ← Back to dashboard
        </Link>

        <h1 className="mt-6 font-heading text-3xl font-semibold text-navy">
          Your profile
        </h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6 rounded-lg border border-border bg-white p-6 shadow-sm lg:p-8">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-dark">Full name</label>
              <input
                id="name"
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-2 w-full rounded-md border border-border bg-warm-white px-4 py-2 text-sm text-dark outline-none focus:border-teal focus:ring-1 focus:ring-teal"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-dark">Email</label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-2 w-full rounded-md border border-border bg-warm-white px-4 py-2 text-sm text-dark outline-none focus:border-teal focus:ring-1 focus:ring-teal"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-dark">Phone</label>
              <input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="mt-2 w-full rounded-md border border-border bg-warm-white px-4 py-2 text-sm text-dark outline-none focus:border-teal focus:ring-1 focus:ring-teal"
              />
            </div>
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-dark">Country</label>
              <input
                id="country"
                type="text"
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                className="mt-2 w-full rounded-md border border-border bg-warm-white px-4 py-2 text-sm text-dark outline-none focus:border-teal focus:ring-1 focus:ring-teal"
              />
            </div>
            <div>
              <label htmlFor="bloodGroup" className="block text-sm font-medium text-dark">Blood group</label>
              <input
                id="bloodGroup"
                type="text"
                value={form.bloodGroup}
                onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
                className="mt-2 w-full rounded-md border border-border bg-warm-white px-4 py-2 text-sm text-dark outline-none focus:border-teal focus:ring-1 focus:ring-teal"
              />
            </div>
            <div>
              <label htmlFor="allergies" className="block text-sm font-medium text-dark">Known allergies</label>
              <input
                id="allergies"
                type="text"
                value={form.allergies}
                onChange={(e) => setForm({ ...form, allergies: e.target.value })}
                className="mt-2 w-full rounded-md border border-border bg-warm-white px-4 py-2 text-sm text-dark outline-none focus:border-teal focus:ring-1 focus:ring-teal"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            {saved && <p className="text-sm text-teal">Profile saved successfully.</p>}
            <button
              type="submit"
              className="ml-auto rounded-md bg-navy px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal"
            >
              Save changes
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
