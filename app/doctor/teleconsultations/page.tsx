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

interface TeleconsultationAppointment extends Appointment {
  dv_cases?: { dv_profiles?: { name: string } | null } | null;
}

export default async function DoctorTeleconsultationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("dv_profiles").select("role").eq("id", user.id).single();
  if (!isDoctor(profile?.role)) redirect("/login");

  const { data: doctor } = await supabaseAdmin.from("dv_doctors").select("id").eq("user_id", user.id).single();

  const { data: appointmentsData } = await supabaseAdmin
    .from("dv_appointments")
    .select("*, dv_cases!inner(patient_id, dv_profiles!patient_id(name))")
    .eq("doctor_id", doctor?.id)
    .or("type.ilike.*tele*,type.ilike.*video*")
    .order("scheduled_at", { ascending: true })
    .limit(50);

  const appointments: TeleconsultationAppointment[] = (appointmentsData as TeleconsultationAppointment[]) || [];

  return (
    <div className="space-y-6">
      <SectionHeader title="Teleconsultations" subtitle="Upcoming and completed video calls with patients" />

      <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-warm-white text-muted">
            <tr>
              <th className="px-5 py-3 font-medium">Patient</th>
              <th className="px-5 py-3 font-medium">Scheduled</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {appointments.map((t) => (
              <tr key={t.id}>
                <td className="px-5 py-4 text-dark">{t.dv_cases?.dv_profiles?.name || "Patient"}</td>
                <td className="px-5 py-4 text-muted">{t.scheduled_at ? formatDateTime(t.scheduled_at) : "TBC"}</td>
                <td className="px-5 py-4"><Badge tone={t.status === "COMPLETED" ? "success" : t.status === "SCHEDULED" ? "info" : "warning"}>{t.status}</Badge></td>
                <td className="px-5 py-4">
                  {t.link ? <a href={t.link} target="_blank" rel="noreferrer" className="text-sm font-medium text-teal hover:text-navy">Join</a> : <span className="text-sm text-muted">—</span>}
                </td>
              </tr>
            ))}
            {appointments.length === 0 && <tr><td className="px-5 py-4 text-muted" colSpan={4}>No teleconsultations scheduled.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
