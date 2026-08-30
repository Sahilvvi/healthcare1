import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import { supabaseAdmin } from "@/app/lib/supabase/admin";
import { SectionHeader } from "@/app/components/dashboard/SectionHeader";
import { Badge } from "@/app/components/dashboard/Badge";
import { isAdmin } from "@/app/lib/roles";
import type { SupportTicket } from "@/app/lib/types";
import { SupportActions } from "./SupportActions";

type TicketRow = SupportTicket & { dv_profiles?: { name: string } | null };

function formatDate(ts: string) {
  return new Date(ts).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default async function AdminSupportPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("dv_profiles").select("role").eq("id", user.id).single();
  if (!isAdmin(profile?.role)) redirect("/login");

  const { data } = await supabaseAdmin.from("dv_support_tickets").select("*, dv_profiles(name)").order("created_at", { ascending: false }).limit(100);
  const tickets: TicketRow[] = (data as TicketRow[]) || [];

  return (
    <div className="space-y-6">
      <SectionHeader title="Support tickets" subtitle="Respond to patient and doctor requests" />

      <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-warm-white text-muted">
            <tr>
              <th className="px-5 py-3 font-medium">Date</th>
              <th className="px-5 py-3 font-medium">User</th>
              <th className="px-5 py-3 font-medium">Subject</th>
              <th className="px-5 py-3 font-medium">Priority</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {tickets.map((t) => (
              <tr key={t.id}>
                <td className="px-5 py-4 text-muted">{formatDate(t.created_at)}</td>
                <td className="px-5 py-4 text-dark">{t.dv_profiles?.name || "—"}</td>
                <td className="px-5 py-4">
                  <p className="font-medium text-dark">{t.subject}</p>
                  <p className="mt-1 text-xs text-muted">{t.message}</p>
                </td>
                <td className="px-5 py-4"><Badge tone={t.priority === "HIGH" ? "danger" : t.priority === "MEDIUM" ? "warning" : "info"}>{t.priority}</Badge></td>
                <td className="px-5 py-4"><SupportActions ticketId={t.id} status={t.status} /></td>
              </tr>
            ))}
            {tickets.length === 0 && <tr><td className="px-5 py-4 text-muted" colSpan={5}>No tickets yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
