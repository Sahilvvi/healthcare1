import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import { supabaseAdmin } from "@/app/lib/supabase/admin";
import { SectionHeader } from "@/app/components/dashboard/SectionHeader";
import { StatCard } from "@/app/components/dashboard/StatCard";
import { isDoctor } from "@/app/lib/roles";
import type { Appointment, Case } from "@/app/lib/types";

export default async function DoctorReportsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("dv_profiles").select("role").eq("id", user.id).single();
  if (!isDoctor(profile?.role)) redirect("/login");

  const { data: doctor } = await supabaseAdmin.from("dv_doctors").select("id").eq("user_id", user.id).single();

  const [{ data: appointmentsData }, { data: casesData }] = await Promise.all([
    doctor ? supabaseAdmin.from("dv_appointments").select("*").eq("doctor_id", doctor.id) : supabaseAdmin.from("dv_appointments").select("*"),
    supabaseAdmin.from("dv_cases").select("*"),
  ]);

  const appointments: Appointment[] = (appointmentsData || []) as Appointment[];
  const cases: Case[] = (casesData || []) as Case[];

  const completed = appointments.filter((a) => a.status === "COMPLETED").length;
  const upcoming = appointments.filter((a) => a.scheduled_at && a.scheduled_at >= new Date().toISOString()).length;
  const cancelled = appointments.filter((a) => a.status === "CANCELLED").length;

  const byStatus: Record<string, number> = {};
  cases.forEach((c) => { byStatus[c.status] = (byStatus[c.status] || 0) + 1; });

  return (
    <div className="space-y-8">
      <SectionHeader title="Reports" subtitle="Practice overview and appointment analytics" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total appointments" value={appointments.length} />
        <StatCard label="Completed" value={completed} />
        <StatCard label="Upcoming" value={upcoming} />
        <StatCard label="Cancelled" value={cancelled} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
          <h2 className="font-heading text-lg font-semibold text-navy">Appointments by status</h2>
          <div className="mt-4 space-y-3">
            {["SCHEDULED", "CONFIRMED", "COMPLETED", "CANCELLED"].map((s) => (
              <div key={s} className="flex items-center justify-between rounded-lg bg-warm-white px-4 py-3 text-sm">
                <span className="text-dark">{s}</span>
                <span className="font-semibold text-navy">{appointments.filter((a) => a.status === s).length}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
          <h2 className="font-heading text-lg font-semibold text-navy">Cases by stage</h2>
          <div className="mt-4 space-y-3">
            {Object.entries(byStatus).sort((a, b) => b[1] - a[1]).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between rounded-lg bg-warm-white px-4 py-3 text-sm">
                <span className="text-dark">{status}</span>
                <span className="font-semibold text-navy">{count}</span>
              </div>
            ))}
            {Object.keys(byStatus).length === 0 && <p className="text-sm text-muted">No case data yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
