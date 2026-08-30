import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import { supabaseAdmin } from "@/app/lib/supabase/admin";
import { SectionHeader } from "@/app/components/dashboard/SectionHeader";
import { StatCard } from "@/app/components/dashboard/StatCard";
import { isAdmin } from "@/app/lib/roles";
import type { Appointment, Case, Transaction } from "@/app/lib/types";

function formatAmount(amount: number) {
  return `USD ${amount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

export default async function AdminReportsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("dv_profiles").select("role").eq("id", user.id).single();
  if (!isAdmin(profile?.role)) redirect("/login");

  const [
    { data: casesData },
    { data: appointmentsData },
    { data: transactionsData },
    { count: patientCount },
    { count: doctorCount },
  ] = await Promise.all([
    supabaseAdmin.from("dv_cases").select("*"),
    supabaseAdmin.from("dv_appointments").select("*"),
    supabaseAdmin.from("dv_transactions").select("*"),
    supabaseAdmin.from("dv_profiles").select("*", { count: "exact", head: true }).eq("role", "patient"),
    supabaseAdmin.from("dv_doctors").select("*", { count: "exact", head: true }),
  ]);

  const cases: Case[] = (casesData || []) as Case[];
  const appointments: Appointment[] = (appointmentsData || []) as Appointment[];
  const transactions: Transaction[] = (transactionsData || []) as Transaction[];

  const revenue = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + Number(t.amount), 0);
  const refunds = transactions.filter((t) => t.type === "refund").reduce((sum, t) => sum + Number(t.amount), 0);
  const net = revenue - refunds - transactions.filter((t) => t.type === "cost").reduce((sum, t) => sum + Number(t.amount), 0);

  const statusCounts: Record<string, number> = {};
  cases.forEach((c) => { statusCounts[c.status] = (statusCounts[c.status] || 0) + 1; });

  const byMonth: Record<string, { income: number; cases: number }> = {};
  transactions.forEach((t) => {
    const key = new Date(t.created_at).toLocaleString("en-IN", { month: "short", year: "numeric" });
    if (!byMonth[key]) byMonth[key] = { income: 0, cases: 0 };
    if (t.type === "income") byMonth[key].income += Number(t.amount);
  });
  cases.forEach((c) => {
    const key = new Date(c.created_at).toLocaleString("en-IN", { month: "short", year: "numeric" });
    if (!byMonth[key]) byMonth[key] = { income: 0, cases: 0 };
    byMonth[key].cases += 1;
  });

  const completionRate = appointments.length ? Math.round((appointments.filter((a) => a.status === "COMPLETED").length / appointments.length) * 100) : 0;

  return (
    <div className="space-y-8">
      <SectionHeader title="Reports" subtitle="Business analytics, trends and operational KPIs" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total patients" value={patientCount ?? 0} />
        <StatCard label="Doctors" value={doctorCount ?? 0} />
        <StatCard label="Appointments" value={appointments.length} />
        <StatCard label="Completion rate" value={`${completionRate}%`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
          <h2 className="font-heading text-lg font-semibold text-navy">Case stages</h2>
          <div className="mt-4 space-y-3">
            {Object.entries(statusCounts).sort((a, b) => b[1] - a[1]).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between rounded-lg bg-warm-white px-4 py-3 text-sm">
                <span className="text-dark">{status}</span>
                <span className="font-semibold text-navy">{count}</span>
              </div>
            ))}
            {Object.keys(statusCounts).length === 0 && <p className="text-sm text-muted">No case data.</p>}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
          <h2 className="font-heading text-lg font-semibold text-navy">Financial summary</h2>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between rounded-lg bg-warm-white px-4 py-3 text-sm">
              <span className="text-dark">Revenue</span>
              <span className="font-semibold text-navy">{formatAmount(revenue)}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-warm-white px-4 py-3 text-sm">
              <span className="text-dark">Refunds</span>
              <span className="font-semibold text-navy">{formatAmount(refunds)}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-warm-white px-4 py-3 text-sm">
              <span className="text-dark">Net profit</span>
              <span className="font-semibold text-navy">{formatAmount(net)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
        <h2 className="font-heading text-lg font-semibold text-navy">Monthly activity</h2>
        <div className="mt-4 overflow-hidden rounded-lg border border-border">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-warm-white text-muted">
              <tr><th className="px-5 py-3 font-medium">Month</th><th className="px-5 py-3 font-medium">New cases</th><th className="px-5 py-3 font-medium text-right">Income</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {Object.entries(byMonth).sort().reverse().map(([month, vals]) => (
                <tr key={month}>
                  <td className="px-5 py-4 text-dark">{month}</td>
                  <td className="px-5 py-4 text-muted">{vals.cases}</td>
                  <td className="px-5 py-4 text-right font-medium text-navy">{formatAmount(vals.income)}</td>
                </tr>
              ))}
              {Object.keys(byMonth).length === 0 && <tr><td className="px-5 py-4 text-muted" colSpan={3}>No activity yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
