"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateCaseStatus } from "./actions";

const stages = ["NEW", "MEDICAL_REVIEW", "CONSULTATION", "PLAN", "TREATMENT", "RECOVERY"];

export function CaseActions({ caseId, currentStatus }: { caseId: string; currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const data = new FormData();
    data.set("caseId", caseId);
    data.set("status", status);
    const result = await updateCaseStatus(data);
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
        {stages.map((s) => (
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
