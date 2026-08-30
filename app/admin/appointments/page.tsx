import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import { supabaseAdmin } from "@/app/lib/supabase/admin";
import { SectionHeader } from "@/app/components/dashboard/SectionHeader";
import { Badge } from "@/app/components/dashboard/Badge";
import { isAdmin } from "@/app/lib/roles";
import type { Appointment } from "@/app/lib/types";

type AppointmentRow = Appointment & {
  dv_doctors?: { name: string; specialty: string } | null;
  dv_profiles?: { name: string } | null;
};

function formatDate(ts: string) {
  const d = new Date(ts);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) + " · " + d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

export default async function AdminAppointmentsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("dv_profiles").select("role").eq("id", user.id).single();
  if (!isAdmin(profile?.role)) redirect("/login");

  const { data } = await supabaseAdmin
    .from("dv_appointments")
    .select("*, dv_doctors!doctor_id(name, specialty), dv_profiles!patient_id(name)")
    .order("scheduled_at", { ascending: false })
    .limit(100);
  const appointments: AppointmentRow[] = (data as AppointmentRow[]) || [];

  return (
    <div className="space-y-6">
      <SectionHeader title="Appointments" subtitle="All scheduled, completed and cancelled consultations" />
      <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-warm-white text-muted">
            <tr>
              <th className="px-5 py-3 font-medium">Patient</th>
              <th className="px-5 py-3 font-medium">Doctor</th>
              <th className="px-5 py-3 font-medium">Scheduled</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Link</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {appointments.map((a) => (
              <tr key={a.id}>
                <td className="px-5 py-4 text-dark">{a.dv_profiles?.name || "—"}</td>
                <td className="px-5 py-4 text-muted">{a.dv_doctors?.name || "—"}{a.dv_doctors?.specialty ? ` · ${a.dv_doctors.specialty}` : ""}</td>
                <td className="px-5 py-4 text-muted">{a.scheduled_at ? formatDate(a.scheduled_at) : "—"}</td>
                <td className="px-5 py-4"><Badge tone={a.status === "CONFIRMED" ? "success" : a.status === "PENDING" ? "warning" : a.status === "CANCELLED" ? "danger" : "info"}>{a.status}</Badge></td>
                <td className="px-5 py-4">
                  {a.link ? <a href={a.link} target="_blank" rel="noreferrer" className="text-sm font-medium text-teal hover:text-navy">Join</a> : <span className="text-muted">—</span>}
                </td>
              </tr>
            ))}
            {appointments.length === 0 && <tr><td className="px-5 py-4 text-muted" colSpan={5}>No appointments yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
