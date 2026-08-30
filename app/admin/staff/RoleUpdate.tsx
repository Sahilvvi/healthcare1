"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { updateUserRole } from "./actions";
import type { Profile } from "@/app/lib/types";

export function RoleUpdate({ users }: { users: Profile[] }) {
  const [status, setStatus] = useState<{ ok?: boolean; error?: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    const formData = new FormData(e.currentTarget);
    const result = await updateUserRole(formData);
    setLoading(false);
    setStatus(result);
    if (result.ok) {
      e.currentTarget.reset();
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4 sm:flex-row">
      {status?.error && <p className="col-span-full text-sm text-red-600">{status.error}</p>}
      {status?.ok && <p className="col-span-full text-sm text-teal">Role updated.</p>}
      <select name="userId" required className="flex-1 rounded-md border border-border bg-warm-white px-4 py-2 text-sm outline-none focus:border-teal">
        <option value="">Select user</option>
        {users.map((u) => (<option key={u.id} value={u.id}>{u.name || u.id.slice(0, 8)} ({u.role})</option>))}
      </select>
      <select name="role" required className="flex-1 rounded-md border border-border bg-warm-white px-4 py-2 text-sm outline-none focus:border-teal">
        <option value="patient">Patient</option>
        <option value="doctor">Doctor</option>
        <option value="admin">Admin</option>
        <option value="superadmin">Superadmin</option>
      </select>
      <button type="submit" disabled={loading} className="rounded-md bg-navy px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-teal disabled:opacity-50">
        {loading ? "Updating..." : "Update role"}
      </button>
    </form>
  );
}
