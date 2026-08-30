"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addPackage } from "./actions";

export function AddPackageForm() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ ok?: boolean; error?: string } | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const result = await addPackage(new FormData(e.currentTarget));
    setLoading(false);
    setStatus(result);

    if (result.ok) {
      e.currentTarget.reset();
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8 rounded-lg border border-border bg-white p-6 shadow-sm">
      <h2 className="font-heading text-lg font-semibold text-navy">Add a package</h2>
      {status?.error && <p className="mt-3 text-sm text-red-600">{status.error}</p>}
      {status?.ok && <p className="mt-3 text-sm text-teal">Package added.</p>}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <input name="name" placeholder="Package name" required className="rounded-md border border-border px-4 py-2 text-sm outline-none focus:border-teal" />
        <input name="specialty" placeholder="Specialty" required className="rounded-md border border-border px-4 py-2 text-sm outline-none focus:border-teal" />
        <input name="price" placeholder="Price (e.g. $4,800)" required className="rounded-md border border-border px-4 py-2 text-sm outline-none focus:border-teal" />
        <input name="stay" placeholder="Stay (e.g. 10–14 days)" required className="rounded-md border border-border px-4 py-2 text-sm outline-none focus:border-teal" />
        <textarea name="description" placeholder="Description" rows={3} className="sm:col-span-2 rounded-md border border-border px-4 py-2 text-sm outline-none focus:border-teal" />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="mt-4 rounded-md bg-navy px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal disabled:opacity-50"
      >
        {loading ? "Adding..." : "Add package"}
      </button>
    </form>
  );
}
