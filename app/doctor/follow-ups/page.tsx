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

interface FollowUpAppointment extends Appointment {
  dv_cases?: { dv_profiles?: { name: string } | null } | null;
}

export default async function DoctorFollowUpsPage() {
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
    .or("type.ilike.*follow*,type.ilike.*in-person*")
    .order("scheduled_at", { ascending: true })
    .limit(50);

  const followUps: FollowUpAppointment[] = (appointmentsData as FollowUpAppointment[]) || [];

  return (
    <div className="space-y-6">
      <SectionHeader title="Follow-ups" subtitle="Scheduled patient follow-ups and reminders" />

      <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-warm-white text-muted">
            <tr>
              <th className="px-5 py-3 font-medium">Patient</th>
              <th className="px-5 py-3 font-medium">Type</th>
              <th className="px-5 py-3 font-medium">Due</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {followUps.map((f) => (
              <tr key={f.id}>
                <td className="px-5 py-4 text-dark">{f.dv_cases?.dv_profiles?.name || "Patient"}</td>
                <td className="px-5 py-4 text-muted">{f.type}</td>
                <td className="px-5 py-4 text-muted">{f.scheduled_at ? formatDateTime(f.scheduled_at) : "TBC"}</td>
                <td className="px-5 py-4"><Badge tone={f.status === "COMPLETED" ? "success" : "info"}>{f.status}</Badge></td>
              </tr>
            ))}
            {followUps.length === 0 && <tr><td className="px-5 py-4 text-muted" colSpan={4}>No follow-ups scheduled.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
