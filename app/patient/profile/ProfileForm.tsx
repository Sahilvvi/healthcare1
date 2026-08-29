"use client";

import { useState } from "react";
import { updateProfile } from "./actions";

export function ProfileForm({
  initial,
  email,
}: {
  initial: {
    name: string;
    phone: string | null;
    country: string | null;
  };
  email: string | undefined;
}) {
  const [form, setForm] = useState({
    name: initial.name,
    phone: initial.phone || "",
    country: initial.country || "",
  });
  const [status, setStatus] = useState<{ ok?: boolean; error?: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => data.set(key, value));
    const result = await updateProfile(data);
    setStatus(result);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border border-border bg-white p-6 shadow-sm lg:p-8">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-dark">Full name</label>
          <input
            id="name"
            name="name"
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
            name="email"
            type="email"
            value={email || ""}
            disabled
            className="mt-2 w-full rounded-md border border-border bg-gray-50 px-4 py-2 text-sm text-muted outline-none"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-dark">Phone</label>
          <input
            id="phone"
            name="phone"
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
            name="country"
            type="text"
            value={form.country}
            onChange={(e) => setForm({ ...form, country: e.target.value })}
            className="mt-2 w-full rounded-md border border-border bg-warm-white px-4 py-2 text-sm text-dark outline-none focus:border-teal focus:ring-1 focus:ring-teal"
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        {status?.ok && <p className="text-sm text-teal">Profile saved successfully.</p>}
        {status?.error && <p className="text-sm text-red-600">{status.error}</p>}
        <button
          type="submit"
          className="ml-auto rounded-md bg-navy px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal"
        >
          Save changes
        </button>
      </div>
    </form>
  );
}
