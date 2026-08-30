"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { uploadDocument } from "./actions";

export function DocumentUploadForm({ caseId }: { caseId?: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [label, setLabel] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ ok?: boolean; error?: string } | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setStatus(null);

    const data = new FormData();
    data.set("file", file);
    data.set("label", label || file.name);
    if (caseId) data.set("caseId", caseId);

    const result = await uploadDocument(data);
    setLoading(false);
    setStatus(result);
    if (result.ok) {
      setFile(null);
      setLabel("");
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-border bg-white p-6 shadow-sm">
      <h2 className="font-heading text-lg font-semibold text-navy">Upload a document</h2>
      {status?.error && <p className="text-sm text-red-600">{status.error}</p>}
      {status?.ok && <p className="text-sm text-teal">Document uploaded successfully.</p>}
      <div>
        <label htmlFor="doc-label" className="block text-sm font-medium text-dark">Label</label>
        <input
          id="doc-label"
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="e.g. Blood report, MRI scan"
          className="mt-2 w-full rounded-md border border-border bg-warm-white px-4 py-2 text-sm text-dark outline-none focus:border-teal"
        />
      </div>
      <div>
        <label htmlFor="doc-file" className="block text-sm font-medium text-dark">File</label>
        <input
          id="doc-file"
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="mt-2 block w-full text-sm text-dark file:mr-4 file:rounded-md file:border-0 file:bg-navy file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-teal"
        />
      </div>
      <button
        type="submit"
        disabled={loading || !file}
        className="rounded-md bg-navy px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal disabled:opacity-50"
      >
        {loading ? "Uploading..." : "Upload document"}
      </button>
    </form>
  );
}
