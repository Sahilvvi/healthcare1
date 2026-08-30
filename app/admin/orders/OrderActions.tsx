"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateOrderStatus } from "./actions";

const statuses = ["PENDING", "CONFIRMED", "PACKING", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"];

export function OrderActions({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const data = new FormData();
    data.set("id", orderId);
    data.set("status", status);
    const result = await updateOrderStatus(data);
    setLoading(false);
    if (result.error) {
      setMessage(result.error);
    } else {
      setMessage("Updated");
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="rounded-md border border-border bg-warm-white px-2 py-1 text-xs text-dark outline-none focus:border-teal"
      >
        {statuses.map((s) => (
          <option key={s} value={s}>
            {s.replace(/_/g, " ")}
          </option>
        ))}
      </select>
      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-navy px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-teal disabled:opacity-50"
      >
        {loading ? "..." : "Update"}
      </button>
      {message && <span className="text-xs text-muted">{message}</span>}
    </form>
  );
}
