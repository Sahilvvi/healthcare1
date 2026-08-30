"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { assignCoordinator } from "./actions";

interface Coordinator {
  id: string;
  name: string;
}

export function AssignCoordinator({
  caseId,
  current,
  coordinators,
}: {
  caseId: string;
  current: string | null;
  coordinators: Coordinator[];
}) {
  const [coordinatorId, setCoordinatorId] = useState(current || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const data = new FormData();
    data.set("caseId", caseId);
    data.set("coordinatorId", coordinatorId);
    const result = await assignCoordinator(data);
    setLoading(false);
    if (result.error) {
      setMessage(result.error);
    } else {
      setMessage("Assigned");
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <select
        value={coordinatorId}
        onChange={(e) => setCoordinatorId(e.target.value)}
        className="rounded-md border border-border bg-warm-white px-2 py-1 text-xs text-dark outline-none focus:border-teal"
      >
        <option value="">Unassigned</option>
        {coordinators.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-teal px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-navy disabled:opacity-50"
      >
        {loading ? "..." : "Assign"}
      </button>
      {message && <span className="text-xs text-muted">{message}</span>}
    </form>
  );
}
