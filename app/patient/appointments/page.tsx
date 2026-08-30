import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import { SectionHeader } from "@/app/components/dashboard/SectionHeader";
import { Badge } from "@/app/components/dashboard/Badge";
import { EmptyState } from "@/app/components/dashboard/EmptyState";
import type { Appointment } from "@/app/lib/types";

function formatDateTime(ts: string) {
  return new Date(ts).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" });
}

export default async function PatientAppointmentsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: cases } = await supabase.from("dv_cases").select("id").eq("patient_id", user.id);
  const caseIds = (cases || []).map((c) => c.id);

  const { data: appointments } = caseIds.length
    ? await supabase
        .from("dv_appointments")
        .select("*, dv_doctors(name, specialty)")
        .in("case_id", caseIds)
        .order("scheduled_at", { ascending: true })
    : { data: [] };

  const list: Appointment[] = (appointments || []) as Appointment[];

  return (
    <div className="space-y-6">
      <SectionHeader title="Appointments" subtitle="All your scheduled consultations and follow-ups" />

      {list.length === 0 ? (
        <EmptyState
          title="No appointments yet"
          subtitle="Book a consultation with a specialist to get started."
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-warm-white text-muted">
              <tr>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Doctor</th>
                <th className="px-5 py-3 font-medium">Scheduled</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {list.map((a) => (
                <tr key={a.id}>
                  <td className="px-5 py-4 text-dark">{a.type}</td>
                  <td className="px-5 py-4 text-muted">{a.dv_doctors?.name || "—"} · {a.dv_doctors?.specialty || "—"}</td>
                  <td className="px-5 py-4 text-muted">{a.scheduled_at ? formatDateTime(a.scheduled_at) : "—"}</td>
                  <td className="px-5 py-4"><Badge tone={a.status === "COMPLETED" ? "success" : a.status === "CANCELLED" ? "danger" : "info"}>{a.status}</Badge></td>
                  <td className="px-5 py-4">
                    {a.link && (
                      <a href={a.link} target="_blank" rel="noreferrer" className="text-sm font-medium text-teal hover:text-navy">
                        Join
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Link href="/doctors" className="inline-flex items-center gap-2 rounded-lg bg-navy px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal">
        Book new appointment
      </Link>
    </div>
  );
}
