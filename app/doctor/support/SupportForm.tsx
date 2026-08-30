"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupportTicket } from "./actions";

export function SupportForm() {
  const [status, setStatus] = useState<{ ok?: boolean; error?: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    const formData = new FormData(e.currentTarget);
    const result = await createSupportTicket(formData);
    setLoading(false);
    setStatus(result);
    if (result.ok) {
      e.currentTarget.reset();
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      {status?.error && <p className="text-sm text-red-600">{status.error}</p>}
      {status?.ok && <p className="text-sm text-teal">Ticket created. We&apos;ll respond shortly.</p>}
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-dark">Subject</label>
        <input id="subject" name="subject" type="text" required className="mt-2 w-full rounded-md border border-border bg-warm-white px-4 py-2 text-sm outline-none focus:border-teal" />
      </div>
      <div>
        <label htmlFor="priority" className="block text-sm font-medium text-dark">Priority</label>
        <select id="priority" name="priority" className="mt-2 w-full rounded-md border border-border bg-warm-white px-4 py-2 text-sm outline-none focus:border-teal">
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-dark">Message</label>
        <textarea id="message" name="message" rows={4} required className="mt-2 w-full rounded-md border border-border bg-warm-white px-4 py-2 text-sm outline-none focus:border-teal" />
      </div>
      <button type="submit" disabled={loading} className="rounded-md bg-navy px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal disabled:opacity-50">
        {loading ? "Submitting..." : "Submit ticket"}
      </button>
    </form>
  );
}
