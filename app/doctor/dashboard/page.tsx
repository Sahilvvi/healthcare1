import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import { supabaseAdmin } from "@/app/lib/supabase/admin";
import { StatCard } from "@/app/components/dashboard/StatCard";
import { QuickLink } from "@/app/components/dashboard/QuickLink";
import { SectionHeader } from "@/app/components/dashboard/SectionHeader";
import { Badge } from "@/app/components/dashboard/Badge";
import { ActivityFeed } from "@/app/components/dashboard/ActivityFeed";
import { Sparkline } from "@/app/components/ui/Sparkline";
import { Reveal } from "@/app/components/Reveal";
import { buildActivityFeed } from "@/app/lib/activity";
import { isDoctor } from "@/app/lib/roles";
import { withoutTitlePrefix } from "@/app/lib/doctorName";
import { Calendar, FileText, Pill, Users, TrendingUp, Banknote, Video, Clock } from "lucide-react";
import type { Appointment, Case, Prescription, Transaction } from "@/app/lib/types";

function formatTime(ts?: string | null) {
  if (!ts) return "TBC";
  return new Date(ts).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
}

function formatCurrency(amount: number, currency = "USD") {
  return `${currency} ${amount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

function monthlyEarnings(transactions: Transaction[]) {
  const months: number[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const start = d.toISOString().slice(0, 7);
    const sum = transactions
      .filter((t) => t.type === "income" && t.created_at.startsWith(start))
      .reduce((s, t) => s + Number(t.amount), 0);
    months.push(sum);
  }
  return months;
}

export default async function DoctorDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("dv_profiles").select("name, role").eq("id", user.id).single();
  if (!isDoctor(profile?.role)) redirect("/login");

  const { data: doctor } = await supabaseAdmin.from("dv_doctors").select("id, name, image").eq("user_id", user.id).single();
  if (!doctor) {
    return (
      <div className="space-y-6">
        <SectionHeader title="Doctor workspace" subtitle={`Welcome back, Dr. ${withoutTitlePrefix(profile?.name) || ""}`} />
        <p className="text-muted">Your doctor profile is not yet linked. Contact the admin team.</p>
      </div>
    );
  }

  const today = new Date().toISOString().slice(0, 10);

  const [
    { data: appointmentsData },
    { data: pendingCasesData },
    { data: prescriptionsData },
    { data: transactionsData },
  ] = await Promise.all([
    supabaseAdmin
      .from("dv_appointments")
      .select("*, dv_cases(id, status, dv_profiles(id, name, country, city))")
      .eq("doctor_id", doctor.id)
      .order("scheduled_at", { ascending: true })
      .limit(200),
    supabaseAdmin
      .from("dv_cases")
      .select("*, dv_profiles(id, name, country, city)")
      .in("status", ["NEW", "MEDICAL_REVIEW", "CONSULTATION"])
      .order("created_at", { ascending: false })
      .limit(20),
    supabaseAdmin
      .from("dv_prescriptions")
      .select("*, dv_profiles(id, name)")
      .eq("doctor_id", doctor.id)
      .order("created_at", { ascending: false })
      .limit(20),
    supabaseAdmin.from("dv_transactions").select("*").eq("doctor_id", doctor.id).order("created_at", { ascending: true }).limit(500),
  ]);

  const appointments: Appointment[] = (appointmentsData || []) as Appointment[];
  const cases: (Case & { dv_profiles?: { name?: string; country?: string; city?: string } | null })[] = (pendingCasesData || []) as unknown as (Case & { dv_profiles?: { name?: string; country?: string; city?: string } | null })[];
  const prescriptions: (Prescription & { dv_profiles?: { name?: string } | null })[] = (prescriptionsData || []) as unknown as (Prescription & { dv_profiles?: { name?: string } | null })[];
  const transactions: Transaction[] = (transactionsData || []) as Transaction[];

  const todayAppointments = appointments.filter((a) => a.scheduled_at?.startsWith(today));
  const upcoming = appointments.filter((a) => a.scheduled_at && a.scheduled_at >= new Date().toISOString());
  const completed = appointments.filter((a) => a.status === "COMPLETED").length;

  const totalEarnings = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + Number(t.amount), 0);
  const uniquePatients = new Set(
    appointments
      .filter((a) => a.case_id)
      .map((a) => (a as unknown as { dv_cases?: { patient_id?: string } | null }).dv_cases?.patient_id)
      .filter(Boolean)
  ).size;

  const earningsChart = monthlyEarnings(transactions);

  const activity = buildActivityFeed({
    appointments: appointments.slice(0, 10),
    cases: cases.slice(0, 10),
  });

  return (
    <div className="space-y-8">
      <SectionHeader title="Doctor workspace" subtitle={`Welcome back, Dr. ${withoutTitlePrefix(profile?.name || doctor.name) || ""}`} showGreeting />

      <Reveal delay={100}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Today's consultations" value={todayAppointments.length} href="/doctor/appointments" icon={Calendar} />
          <StatCard label="Pending cases" value={cases.length} href="/doctor/patients" icon={FileText} />
          <StatCard label="Completed appointments" value={completed} href="/doctor/appointments" icon={Clock} />
          <StatCard label="Total earnings" value={formatCurrency(totalEarnings)} href="/doctor/earnings" icon={Banknote} />
          <StatCard label="My patients" value={uniquePatients} href="/doctor/patients" icon={Users} />
          <StatCard label="Prescriptions" value={prescriptions.length} href="/doctor/prescriptions" icon={Pill} />
          <StatCard label="Upcoming" value={upcoming.length} href="/doctor/appointments" icon={Video} />
          <StatCard label="Profile" value="View" href="/doctor/settings" subtext="Update availability" icon={TrendingUp} />
        </div>
      </Reveal>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Reveal delay={150}>
            <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-heading text-lg font-semibold text-navy">Earnings trend</h2>
                <span className="text-sm text-muted">Last 6 months</span>
              </div>
              <div className="h-40">
                <Sparkline data={earningsChart} color="#0F766E" height={120} />
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-muted">Total earnings</span>
                <span className="font-heading text-xl font-semibold text-navy">{formatCurrency(totalEarnings)}</span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-heading text-lg font-semibold text-navy">Today&apos;s schedule</h2>
                <Link href="/doctor/appointments" className="text-sm font-medium text-teal hover:text-navy">View all</Link>
              </div>
              {todayAppointments.length === 0 ? (
                <p className="text-sm text-muted">No consultations scheduled for today.</p>
              ) : (
                <div className="space-y-3">
                  {todayAppointments.map((a) => (
                    <div key={a.id} className="flex items-center justify-between rounded-xl bg-warm-white px-4 py-3 transition-colors hover:bg-sage/30">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sage">
                          <Calendar className="h-5 w-5 text-teal" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-dark">{a.type}</p>
                          <p className="text-xs text-muted">{formatTime(a.scheduled_at)} · {(a as unknown as { dv_cases?: { dv_profiles?: { name?: string } | null } | null }).dv_cases?.dv_profiles?.name || "Patient"}</p>
                        </div>
                      </div>
                      <Badge tone={a.status === "COMPLETED" ? "success" : a.status === "SCHEDULED" ? "info" : "warning"}>{a.status}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Reveal>

          <Reveal delay={250}>
            <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-heading text-lg font-semibold text-navy">Pending cases</h2>
                <Link href="/doctor/patients" className="text-sm font-medium text-teal hover:text-navy">View all</Link>
              </div>
              {cases.length === 0 ? (
                <p className="text-sm text-muted">No pending cases.</p>
              ) : (
                <ul className="space-y-3">
                  {cases.slice(0, 5).map((c) => (
                    <li key={c.id} className="flex items-center justify-between rounded-xl bg-warm-white px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sage">
                          <Users className="h-5 w-5 text-teal" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-dark">{c.category || "Case"}</p>
                          <p className="text-xs text-muted">{c.dv_profiles?.name || "—"} · {c.dv_profiles?.country || "—"}</p>
                        </div>
                      </div>
                      <Link href={`/doctor/case/${c.id}`} className="text-sm font-medium text-teal hover:text-navy">Open</Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Reveal>
        </div>

        <div className="space-y-6">
          <Reveal delay={200}>
            <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 overflow-hidden rounded-full bg-sage">
                  {doctor.image ? (
                    <Image src={doctor.image} alt={doctor.name} fill className="object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-lg font-semibold text-navy">{doctor.name?.charAt(0) || "D"}</div>
                  )}
                </div>
                <div>
                  <p className="font-heading text-lg font-semibold text-navy">Dr. {withoutTitlePrefix(doctor.name)}</p>
                  <p className="text-sm text-muted">Doctor workspace</p>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <QuickLink href="/doctor/patients" icon={Users} label="Patients" />
                <QuickLink href="/doctor/prescriptions" icon={Pill} label="Prescriptions" />
                <QuickLink href="/doctor/case-notes" icon={FileText} label="Notes" />
                <QuickLink href="/doctor/reports" icon={TrendingUp} label="Reports" />
              </div>
            </div>
          </Reveal>

          <Reveal delay={250}>
            <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-heading text-lg font-semibold text-navy">Recent prescriptions</h2>
                <Link href="/doctor/prescriptions" className="text-xs font-medium text-teal hover:text-navy">View all</Link>
              </div>
              {prescriptions.length === 0 ? (
                <p className="text-sm text-muted">No prescriptions written yet.</p>
              ) : (
                <ul className="space-y-3">
                  {prescriptions.slice(0, 5).map((rx) => (
                    <li key={rx.id} className="flex items-center justify-between rounded-xl bg-warm-white px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Pill className="h-5 w-5 text-teal" />
                        <div>
                          <p className="text-sm font-medium text-dark">{rx.medications?.[0]?.name || "Prescription"}</p>
                          <p className="text-xs text-muted">{rx.dv_profiles?.name || "Patient"} · {rx.status}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Reveal>

          <Reveal delay={300}>
            <ActivityFeed items={activity} title="Recent activity" />
          </Reveal>
        </div>
      </div>
    </div>
  );
}
