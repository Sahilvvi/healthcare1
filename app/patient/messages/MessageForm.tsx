"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { sendMessage } from "./actions";

export function MessageForm({ caseId }: { caseId: string }) {
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const data = new FormData();
    data.set("caseId", caseId);
    data.set("content", content);

    const result = await sendMessage(data);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setContent("");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3">
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-3">
        <input
          type="text"
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 rounded-md border border-border px-4 py-2.5 text-sm outline-none focus:border-teal"
        />
        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="rounded-md bg-navy px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </form>
  );
}
