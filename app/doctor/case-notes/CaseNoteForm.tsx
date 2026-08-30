"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addCaseNote } from "./actions";

interface CaseOption { id: string; category: string | null; patient_id: string; }

export function CaseNoteForm({ cases }: { cases: CaseOption[] }) {
  const [caseId, setCaseId] = useState(cases[0]?.id || "");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<{ ok?: boolean; error?: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    const formData = new FormData();
    formData.set("caseId", caseId);
    formData.set("note", note);
    const result = await addCaseNote(formData);
    setLoading(false);
    setStatus(result);
    if (result.ok) {
      setNote("");
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      {status?.error && <p className="text-sm text-red-600">{status.error}</p>}
      {status?.ok && <p className="text-sm text-teal">Note added.</p>}

      <div>
        <label htmlFor="case" className="block text-sm font-medium text-dark">Case</label>
        <select
          id="case"
          value={caseId}
          onChange={(e) => setCaseId(e.target.value)}
          required
          className="mt-2 w-full rounded-md border border-border bg-warm-white px-4 py-2 text-sm text-dark outline-none focus:border-teal"
        >
          {cases.map((c) => <option key={c.id} value={c.id}>{c.category || "Case"} {c.id.slice(0, 8)}</option>)}
        </select>
      </div>

      <div>
        <label htmlFor="note" className="block text-sm font-medium text-dark">Note</label>
        <textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={4}
          required
          className="mt-2 w-full rounded-md border border-border bg-warm-white px-4 py-2 text-sm text-dark outline-none focus:border-teal"
        />
      </div>

      <button
        type="submit"
        disabled={loading || !caseId || !note.trim()}
        className="rounded-md bg-navy px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal disabled:opacity-50"
      >
        {loading ? "Saving..." : "Add note"}
      </button>
    </form>
  );
}
