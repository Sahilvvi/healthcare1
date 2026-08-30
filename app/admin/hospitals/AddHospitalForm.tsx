"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addHospital } from "./actions";

export function AddHospitalForm() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ ok?: boolean; error?: string } | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const result = await addHospital(new FormData(e.currentTarget));
    setLoading(false);
    setStatus(result);

    if (result.ok) {
      e.currentTarget.reset();
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8 rounded-lg border border-border bg-white p-6 shadow-sm">
      <h2 className="font-heading text-lg font-semibold text-navy">Add a hospital</h2>
      {status?.error && <p className="mt-3 text-sm text-red-600">{status.error}</p>}
      {status?.ok && <p className="mt-3 text-sm text-teal">Hospital added.</p>}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <input name="name" placeholder="Hospital name" required className="rounded-md border border-border px-4 py-2 text-sm outline-none focus:border-teal" />
        <input name="city" placeholder="City" required className="rounded-md border border-border px-4 py-2 text-sm outline-none focus:border-teal" />
        <input name="country" placeholder="Country" defaultValue="India" className="rounded-md border border-border px-4 py-2 text-sm outline-none focus:border-teal" />
        <input name="beds" placeholder="Beds (e.g. 500+)" className="rounded-md border border-border px-4 py-2 text-sm outline-none focus:border-teal" />
        <input name="image" placeholder="Image URL (optional)" className="rounded-md border border-border px-4 py-2 text-sm outline-none focus:border-teal" />
        <textarea name="about" placeholder="About" rows={3} className="sm:col-span-2 rounded-md border border-border px-4 py-2 text-sm outline-none focus:border-teal" />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="mt-4 rounded-md bg-navy px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal disabled:opacity-50"
      >
        {loading ? "Adding..." : "Add hospital"}
      </button>
    </form>
  );
}
