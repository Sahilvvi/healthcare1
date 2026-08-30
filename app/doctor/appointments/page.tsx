import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import { supabaseAdmin } from "@/app/lib/supabase/admin";
import { SectionHeader } from "@/app/components/dashboard/SectionHeader";
import { Badge } from "@/app/components/dashboard/Badge";
import { isDoctor } from "@/app/lib/roles";
import type { Appointment } from "@/app/lib/types";

function formatDateTime(ts: string) {
  return new Date(ts).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" });
}

export default async function DoctorAppointmentsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("dv_profiles").select("role").eq("id", user.id).single();
  if (!isDoctor(profile?.role)) redirect("/login");

  const { data: doctor } = await supabaseAdmin.from("dv_doctors").select("id").eq("user_id", user.id).single();

  let query = supabaseAdmin.from("dv_appointments").select("*").order("scheduled_at", { ascending: true }).limit(100);
  if (doctor) query = query.eq("doctor_id", doctor.id);

  const { data: appointments } = await query;
  const list: Appointment[] = (appointments || []) as Appointment[];

  return (
    <div className="space-y-6">
      <SectionHeader title="Appointments" subtitle="Upcoming consultations, procedures and follow-ups" />

      <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-warm-white text-muted">
            <tr>
              <th className="px-5 py-3 font-medium">Type</th>
              <th className="px-5 py-3 font-medium">Scheduled</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Link</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {list.map((a) => (
              <tr key={a.id}>
                <td className="px-5 py-4 text-dark">{a.type}</td>
                <td className="px-5 py-4 text-muted">{a.scheduled_at ? formatDateTime(a.scheduled_at) : "—"}</td>
                <td className="px-5 py-4"><Badge tone={a.status === "COMPLETED" ? "success" : a.status === "SCHEDULED" ? "info" : "warning"}>{a.status}</Badge></td>
                <td className="px-5 py-4">
                  {a.link ? <a href={a.link} target="_blank" rel="noreferrer" className="text-sm font-medium text-teal hover:text-navy">Join</a> : <span className="text-sm text-muted">—</span>}
                </td>
              </tr>
            ))}
            {list.length === 0 && <tr><td className="px-5 py-4 text-muted" colSpan={4}>No appointments yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
