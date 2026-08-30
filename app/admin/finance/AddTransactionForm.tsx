"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createTransaction } from "./actions";

export function AddTransactionForm() {
  const [status, setStatus] = useState<{ ok?: boolean; error?: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    const result = await createTransaction(new FormData(e.currentTarget));
    setLoading(false);
    setStatus(result);
    if (result.ok) {
      e.currentTarget.reset();
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-5 space-y-4">
      {status?.error && <p className="text-sm text-red-600">{status.error}</p>}
      {status?.ok && <p className="text-sm text-teal">Transaction recorded.</p>}
      <div className="grid gap-4 sm:grid-cols-2">
        <input name="description" type="text" required placeholder="Description" className="w-full rounded-xl border border-border bg-warm-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-teal focus:ring-1 focus:ring-teal" />
        <input name="category" type="text" placeholder="Category" className="w-full rounded-xl border border-border bg-warm-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-teal focus:ring-1 focus:ring-teal" />
        <select name="type" className="w-full rounded-xl border border-border bg-warm-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-teal focus:ring-1 focus:ring-teal">
          <option value="income">Income</option>
          <option value="cost">Cost</option>
          <option value="refund">Refund</option>
        </select>
        <input name="amount" type="number" step="0.01" required placeholder="Amount" className="w-full rounded-xl border border-border bg-warm-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-teal focus:ring-1 focus:ring-teal" />
      </div>
      <button type="submit" disabled={loading} className="w-full rounded-xl bg-navy py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal disabled:opacity-50">
        {loading ? "Saving..." : "Record transaction"}
      </button>
    </form>
  );
}
