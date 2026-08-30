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
    <form onSubmit={handleSubmit} className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {status?.error && <p className="col-span-full text-sm text-red-600">{status.error}</p>}
      {status?.ok && <p className="col-span-full text-sm text-teal">Transaction recorded.</p>}
      <input name="description" type="text" required placeholder="Description" className="rounded-md border border-border bg-warm-white px-4 py-2 text-sm outline-none focus:border-teal" />
      <input name="category" type="text" placeholder="Category" className="rounded-md border border-border bg-warm-white px-4 py-2 text-sm outline-none focus:border-teal" />
      <select name="type" className="rounded-md border border-border bg-warm-white px-4 py-2 text-sm outline-none focus:border-teal">
        <option value="income">Income</option>
        <option value="cost">Cost</option>
        <option value="refund">Refund</option>
      </select>
      <input name="amount" type="number" step="0.01" required placeholder="Amount" className="rounded-md border border-border bg-warm-white px-4 py-2 text-sm outline-none focus:border-teal" />
      <button type="submit" disabled={loading} className="rounded-md bg-navy px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-teal disabled:opacity-50">
        {loading ? "Saving..." : "Record"}
      </button>
    </form>
  );
}
