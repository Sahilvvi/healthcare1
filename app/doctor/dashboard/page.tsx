import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import { supabaseAdmin } from "@/app/lib/supabase/admin";
import { StatCard } from "@/app/components/dashboard/StatCard";
import { SectionHeader } from "@/app/components/dashboard/SectionHeader";
import { Badge } from "@/app/components/dashboard/Badge";
import { ActivityFeed } from "@/app/components/dashboard/ActivityFeed";
import { buildActivityFeed } from "@/app/lib/activity";
import { isDoctor } from "@/app/lib/roles";
import type { Appointment, Case } from "@/app/lib/types";

function formatTime(ts?: string | null) {
  if (!ts) return "TBC";
  return new Date(ts).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
}

function formatCurrency(amount: number, currency: string) {
  return `${currency} ${amount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

export default async function DoctorDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("dv_profiles").select("name, role").eq("id", user.id).single();
  if (!isDoctor(profile?.role)) redirect("/login");

  const { data: doctor } = await supabaseAdmin.from("dv_doctors").select("id").eq("user_id", user.id).single();
  if (!doctor) {
    return (
      <div className="space-y-6">
        <SectionHeader title="Doctor workspace" subtitle={`Welcome back, Dr. ${profile?.name || ""}`} />
        <p className="text-muted">Your doctor profile is not yet linked. Contact the admin team.</p>
      </div>
    );
  }

  const today = new Date().toISOString().slice(0, 10);

  const [{ data: appointments }, { data: pendingCases }, { data: transactions }] = await Promise.all([
    supabaseAdmin.from("dv_appointments").select("*").eq("doctor_id", doctor.id).order("scheduled_at", { ascending: true }).limit(100),
    supabaseAdmin.from("dv_cases").select("*").eq("status", "NEW").order("created_at", { ascending: false }).limit(20),
    supabaseAdmin.from("dv_transactions").select("*").eq("doctor_id", doctor.id).order("created_at", { ascending: false }).limit(100),
  ]);

  const appointmentList: Appointment[] = (appointments || []) as Appointment[];
  const cases: Case[] = (pendingCases || []) as Case[];
  const todayAppointments = appointmentList.filter((a) => a.scheduled_at?.startsWith(today));
  const upcoming = appointmentList.filter((a) => a.scheduled_at && a.scheduled_at >= new Date().toISOString());
  const completed = appointmentList.filter((a) => a.status === "COMPLETED").length;

  const totalEarnings = (transactions || [])
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const activity = buildActivityFeed({
    appointments: appointmentList.slice(0, 10),
    cases: cases.slice(0, 10),
  });

  return (
    <div className="space-y-8">
      <SectionHeader title="Doctor workspace" subtitle={`Welcome back, Dr. ${profile?.name || ""}`} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Today's consultations" value={todayAppointments.length} href="/doctor/appointments" />
        <StatCard label="Pending cases" value={cases.length} href="/doctor/patients" />
        <StatCard label="Completed appointments" value={completed} href="/doctor/appointments" />
        <StatCard label="Total earnings" value={formatCurrency(totalEarnings, "USD")} href="/doctor/earnings" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-white p-6 shadow-sm lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold text-navy">Today&apos;s schedule</h2>
            <Link href="/doctor/appointments" className="text-sm font-medium text-teal hover:text-navy">View all</Link>
          </div>
          {todayAppointments.length === 0 ? (
            <p className="text-sm text-muted">No consultations scheduled for today.</p>
          ) : (
            <div className="space-y-3">
              {todayAppointments.map((a) => (
                <div key={a.id} className="flex items-center justify-between rounded-lg bg-warm-white px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-dark">{a.type}</p>
                    <p className="text-xs text-muted">{formatTime(a.scheduled_at)}</p>
                  </div>
                  <Badge tone={a.status === "COMPLETED" ? "success" : a.status === "SCHEDULED" ? "info" : "warning"}>{a.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
            <h2 className="font-heading text-lg font-semibold text-navy">Quick actions</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Link href="/doctor/patients" className="rounded-lg border border-border bg-warm-white px-3 py-2.5 text-center text-sm font-medium text-dark transition-colors hover:border-navy">Patients</Link>
              <Link href="/doctor/prescriptions" className="rounded-lg border border-border bg-warm-white px-3 py-2.5 text-center text-sm font-medium text-dark transition-colors hover:border-navy">Prescriptions</Link>
              <Link href="/doctor/case-notes" className="rounded-lg border border-border bg-warm-white px-3 py-2.5 text-center text-sm font-medium text-dark transition-colors hover:border-navy">Case notes</Link>
              <Link href="/doctor/reports" className="rounded-lg border border-border bg-warm-white px-3 py-2.5 text-center text-sm font-medium text-dark transition-colors hover:border-navy">Reports</Link>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
            <h2 className="font-heading text-lg font-semibold text-navy">Upcoming</h2>
            {upcoming.length === 0 ? (
              <p className="mt-2 text-sm text-muted">No upcoming appointments.</p>
            ) : (
              <p className="mt-2 text-sm text-muted">Next: {formatTime(upcoming[0].scheduled_at)}</p>
            )}
            <Link href="/doctor/teleconsultations" className="mt-4 inline-block text-sm font-medium text-teal hover:text-navy">Teleconsultations →</Link>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
          <h2 className="font-heading text-lg font-semibold text-navy">Pending cases</h2>
          {cases.length === 0 ? (
            <p className="mt-4 text-sm text-muted">No pending cases.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {cases.slice(0, 5).map((c) => (
                <li key={c.id} className="flex items-center justify-between rounded-lg bg-warm-white px-4 py-3 text-sm">
                  <div>
                    <p className="font-medium text-dark">{c.category}</p>
                    <p className="text-muted">{c.condition?.slice(0, 60) || "—"}</p>
                  </div>
                  <Link href={`/doctor/case/${c.id}`} className="text-sm font-medium text-teal hover:text-navy">Open</Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <ActivityFeed items={activity} title="Recent activity" />
      </div>
    </div>
  );
}
