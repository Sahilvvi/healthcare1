import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import { SectionHeader } from "@/app/components/dashboard/SectionHeader";
import { SupportForm } from "./SupportForm";
import { Badge } from "@/app/components/dashboard/Badge";
import type { SupportTicket } from "@/app/lib/types";

function formatDate(ts: string) {
  return new Date(ts).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default async function PatientSupportPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data } = await supabase
    .from("dv_support_tickets")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const tickets: SupportTicket[] = (data || []) as SupportTicket[];

  return (
    <div className="space-y-8">
      <SectionHeader title="Support" subtitle="Create a ticket or track existing requests" />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-white p-6 shadow-sm lg:col-span-1">
          <h2 className="font-heading text-lg font-semibold text-navy">New ticket</h2>
          <SupportForm />
        </div>

        <div className="rounded-xl border border-border bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="font-heading text-lg font-semibold text-navy">Your tickets</h2>
          {tickets.length === 0 ? (
            <p className="mt-4 text-sm text-muted">No tickets yet.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {tickets.map((t) => (
                <div key={t.id} className="rounded-lg border border-border bg-warm-white p-4">
                  <div className="flex items-start justify-between">
                    <p className="font-medium text-dark">{t.subject}</p>
                    <Badge tone={t.status === "OPEN" ? "warning" : t.status === "RESOLVED" ? "success" : "info"}>{t.status}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted">{t.message}</p>
                  <p className="mt-2 text-xs text-muted">{formatDate(t.created_at)} · {t.priority}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
