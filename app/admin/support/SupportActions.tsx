"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { updateTicketStatus } from "./actions";

export function SupportActions({ ticketId, status }: { ticketId: string; status: string }) {
  const [current, setCurrent] = useState(status);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value;
    setLoading(true);
    const result = await updateTicketStatus(ticketId, next);
    setLoading(false);
    if (result.ok) {
      setCurrent(next);
      router.refresh();
    }
  }

  return (
    <select value={current} onChange={handleChange} disabled={loading} className="rounded-md border border-border bg-warm-white px-3 py-1.5 text-sm outline-none focus:border-teal disabled:opacity-50">
      <option value="OPEN">Open</option>
      <option value="IN_PROGRESS">In progress</option>
      <option value="RESOLVED">Resolved</option>
    </select>
  );
}
