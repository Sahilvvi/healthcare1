"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addCaseNote, addPrescription, scheduleFollowUp } from "./actions";

export function CaseNoteForm({ caseId }: { caseId: string }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ ok?: boolean; error?: string } | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    const result = await addCaseNote(new FormData(e.currentTarget));
    setLoading(false);
    setStatus(result);
    if (result.ok) {
      e.currentTarget.reset();
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input type="hidden" name="caseId" value={caseId} />
      <textarea
        name="note"
        rows={3}
        placeholder="Write a case note..."
        required
        className="w-full rounded-md border border-border px-4 py-2 text-sm text-dark outline-none focus:border-teal"
      />
      {status?.error && <p className="text-xs text-red-600">{status.error}</p>}
      {status?.ok && <p className="text-xs text-teal">Note added.</p>}
      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-navy px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal disabled:opacity-50"
      >
        {loading ? "Saving..." : "Add case note"}
      </button>
    </form>
  );
}

export function PrescriptionForm({ caseId, patientId }: { caseId: string; patientId: string }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ ok?: boolean; error?: string } | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    const result = await addPrescription(new FormData(e.currentTarget));
    setLoading(false);
    setStatus(result);
    if (result.ok) {
      e.currentTarget.reset();
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-2">
      <input type="hidden" name="caseId" value={caseId} />
      <input type="hidden" name="patientId" value={patientId} />
      <input name="name" placeholder="Medicine name" required className="rounded-md border border-border px-4 py-2 text-sm outline-none focus:border-teal" />
      <input name="dosage" placeholder="Dosage" required className="rounded-md border border-border px-4 py-2 text-sm outline-none focus:border-teal" />
      <input name="duration" placeholder="Duration" className="sm:col-span-2 rounded-md border border-border px-4 py-2 text-sm outline-none focus:border-teal" />
      <div className="sm:col-span-2">
        {status?.error && <p className="text-xs text-red-600">{status.error}</p>}
        {status?.ok && <p className="text-xs text-teal">Prescription added.</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-1 rounded-md bg-navy px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal disabled:opacity-50"
        >
          {loading ? "Saving..." : "Add prescription"}
        </button>
      </div>
    </form>
  );
}

export function FollowUpForm({ caseId, patientId }: { caseId: string; patientId: string }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ ok?: boolean; error?: string } | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    const result = await scheduleFollowUp(new FormData(e.currentTarget));
    setLoading(false);
    setStatus(result);
    if (result.ok) {
      e.currentTarget.reset();
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-2">
      <input type="hidden" name="caseId" value={caseId} />
      <input type="hidden" name="patientId" value={patientId} />
      <select name="type" required className="rounded-md border border-border px-4 py-2 text-sm outline-none focus:border-teal">
        <option value="FOLLOW_UP">In-person follow-up</option>
        <option value="TELECONSULTATION">Teleconsultation</option>
      </select>
      <input type="datetime-local" name="scheduledAt" required className="rounded-md border border-border px-4 py-2 text-sm outline-none focus:border-teal" />
      <div className="sm:col-span-2">
        {status?.error && <p className="text-xs text-red-600">{status.error}</p>}
        {status?.ok && <p className="text-xs text-teal">Follow-up scheduled.</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-1 rounded-md bg-navy px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal disabled:opacity-50"
        >
          {loading ? "Saving..." : "Schedule"}
        </button>
      </div>
    </form>
  );
}
