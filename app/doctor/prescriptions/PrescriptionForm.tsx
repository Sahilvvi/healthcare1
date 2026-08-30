"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPrescription } from "./actions";

interface CaseOption { id: string; category: string | null; patient_id: string; }

export function PrescriptionForm({ cases }: { cases: CaseOption[] }) {
  const [caseId, setCaseId] = useState(cases[0]?.id || "");
  const [notes, setNotes] = useState("");
  const [meds, setMeds] = useState([{ name: "", dosage: "", frequency: "", duration: "" }]);
  const [status, setStatus] = useState<{ ok?: boolean; error?: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function updateMed(i: number, field: keyof typeof meds[0], value: string) {
    setMeds((prev) => prev.map((m, idx) => idx === i ? { ...m, [field]: value } : m));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    const formData = new FormData();
    formData.set("caseId", caseId);
    formData.set("notes", notes);
    formData.set("medications", JSON.stringify(meds.filter((m) => m.name)));
    const result = await createPrescription(formData);
    setLoading(false);
    setStatus(result);
    if (result.ok) {
      setNotes("");
      setMeds([{ name: "", dosage: "", frequency: "", duration: "" }]);
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      {status?.error && <p className="text-sm text-red-600">{status.error}</p>}
      {status?.ok && <p className="text-sm text-teal">Prescription saved.</p>}

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

      {meds.map((med, i) => (
        <div key={i} className="grid gap-3 sm:grid-cols-4">
          <input value={med.name} onChange={(e) => updateMed(i, "name", e.target.value)} placeholder="Medicine" className="rounded-md border border-border bg-warm-white px-3 py-2 text-sm outline-none focus:border-teal" />
          <input value={med.dosage} onChange={(e) => updateMed(i, "dosage", e.target.value)} placeholder="Dosage" className="rounded-md border border-border bg-warm-white px-3 py-2 text-sm outline-none focus:border-teal" />
          <input value={med.frequency} onChange={(e) => updateMed(i, "frequency", e.target.value)} placeholder="Frequency" className="rounded-md border border-border bg-warm-white px-3 py-2 text-sm outline-none focus:border-teal" />
          <input value={med.duration} onChange={(e) => updateMed(i, "duration", e.target.value)} placeholder="Duration" className="rounded-md border border-border bg-warm-white px-3 py-2 text-sm outline-none focus:border-teal" />
        </div>
      ))}

      <button
        type="button"
        onClick={() => setMeds([...meds, { name: "", dosage: "", frequency: "", duration: "" }])}
        className="text-sm font-medium text-teal hover:text-navy"
      >
        + Add medication
      </button>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-dark">Notes</label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="mt-2 w-full rounded-md border border-border bg-warm-white px-4 py-2 text-sm text-dark outline-none focus:border-teal"
        />
      </div>

      <button
        type="submit"
        disabled={loading || !caseId || meds.every((m) => !m.name)}
        className="rounded-md bg-navy px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save prescription"}
      </button>
    </form>
  );
}
