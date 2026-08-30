import Link from "next/link";
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
import { isAdmin } from "@/app/lib/roles";
import { Banknote, Users, Stethoscope, Building2, Package, Calendar, ShoppingCart, HeadphonesIcon, Briefcase, TrendingUp, Wallet } from "lucide-react";
import type { Case, Profile, Transaction } from "@/app/lib/types";

function formatDate(ts: string) {
  return new Date(ts).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function formatAmount(amount: number, currency = "USD") {
  return `${currency} ${amount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

function monthlySeries(transactions: Transaction[], type: "income" | "cost" | "refund") {
  const months: number[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const start = d.toISOString().slice(0, 7);
    const sum = transactions
      .filter((t) => t.type === type && t.created_at.startsWith(start))
      .reduce((s, t) => s + Number(t.amount), 0);
    months.push(sum);
  }
  return months;
}

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("dv_profiles").select("role").eq("id", user.id).single();
  if (!isAdmin(profile?.role)) redirect("/login");

  const todayStart = new Date().toISOString().slice(0, 10) + "T00:00:00";
  const todayEnd = new Date().toISOString().slice(0, 10) + "T23:59:59";

  const [
    { count: patientCount },
    { count: activeCaseCount },
    { count: todayConsultCount },
    { count: orderCount },
    { count: ticketCount },
    { count: doctorCount },
    { count: hospitalCount },
    { count: packageCount },
    { data: cases },
    { data: transactionsData },
    { data: recentTransactionsData },
  ] = await Promise.all([
    supabaseAdmin.from("dv_profiles").select("*", { count: "exact", head: true }).eq("role", "patient"),
    supabaseAdmin.from("dv_cases").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("dv_appointments").select("*", { count: "exact", head: true }).gte("scheduled_at", todayStart).lte("scheduled_at", todayEnd),
    supabaseAdmin.from("dv_medicine_orders").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("dv_support_tickets").select("*", { count: "exact", head: true }).eq("status", "OPEN"),
    supabaseAdmin.from("dv_doctors").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("dv_hospitals").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("dv_packages").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("dv_cases").select("*, dv_profiles(name, country)").order("created_at", { ascending: false }).limit(15),
    supabaseAdmin.from("dv_transactions").select("*").order("created_at", { ascending: true }).limit(500),
    supabaseAdmin.from("dv_transactions").select("*").order("created_at", { ascending: false }).limit(8),
  ]);

  const casesList: (Case & { dv_profiles?: Profile | null })[] = (cases as (Case & { dv_profiles?: Profile | null })[]) || [];
  const transactions: Transaction[] = (transactionsData || []) as Transaction[];
  const recentTransactions: Transaction[] = (recentTransactionsData || []) as Transaction[];

  const recentPatientIds = Array.from(new Set(recentTransactions.map((t) => t.patient_id).filter(Boolean))) as string[];
  const { data: recentProfiles } = recentPatientIds.length
    ? await supabaseAdmin.from("dv_profiles").select("id, name").in("id", recentPatientIds)
    : { data: [] };
  const recentProfileMap = new Map((recentProfiles || []).map((p: { id: string; name: string }) => [p.id, p.name]));

  const revenue = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + Number(t.amount), 0);
  const costs = transactions.filter((t) => t.type === "cost").reduce((sum, t) => sum + Number(t.amount), 0);
  const refunds = transactions.filter((t) => t.type === "refund").reduce((sum, t) => sum + Number(t.amount), 0);
  const netProfit = revenue - costs - refunds;

  const revenueChart = monthlySeries(transactions, "income");
  const costChart = monthlySeries(transactions, "cost");
  const refundChart = monthlySeries(transactions, "refund");
  const netChart = revenueChart.map((r, i) => r - costChart[i] - refundChart[i]);

  const activity = buildActivityFeed({ cases: casesList, transactions: transactions.slice(0, 10) });

  return (
    <div className="space-y-8">
      <SectionHeader title="Admin dashboard" subtitle="International patient operations, finance and platform analytics" showGreeting />

      <Reveal delay={100}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="International patients" value={patientCount ?? 0} href="/admin/patients" icon={Users} />
          <StatCard label="Active cases" value={activeCaseCount ?? 0} href="/admin/patients" icon={Briefcase} />
          <StatCard label="Today's consultations" value={todayConsultCount ?? 0} href="/admin/appointments" icon={Calendar} />
          <StatCard label="Medicine orders" value={orderCount ?? 0} href="/admin/orders" icon={ShoppingCart} />
          <StatCard label="Open tickets" value={ticketCount ?? 0} href="/admin/support" icon={HeadphonesIcon} />
          <StatCard label="Doctors" value={doctorCount ?? 0} href="/admin/doctors" icon={Stethoscope} />
          <StatCard label="Hospitals" value={hospitalCount ?? 0} href="/admin/hospitals" icon={Building2} />
          <StatCard label="Packages" value={packageCount ?? 0} href="/admin/packages" icon={Package} />
        </div>
      </Reveal>

      <Reveal delay={150}>
        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-heading text-lg font-semibold text-navy">Financial summary</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <StatCard label="Total revenue" value={formatAmount(revenue)} changeType="positive" href="/admin/finance" icon={TrendingUp} />
            <StatCard label="Costs" value={formatAmount(costs)} changeType="negative" href="/admin/finance" icon={Banknote} />
            <StatCard label="Refunds" value={formatAmount(refunds)} href="/admin/finance" icon={Wallet} />
            <StatCard label="Net profit" value={formatAmount(netProfit)} changeType={netProfit >= 0 ? "positive" : "negative"} href="/admin/finance" icon={TrendingUp} />
            <StatCard label="Transactions" value={transactions.length} href="/admin/finance" icon={Banknote} />
          </div>
        </div>
      </Reveal>

      <div className="grid gap-6 lg:grid-cols-2">
        <Reveal delay={200}>
          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-heading text-lg font-semibold text-navy">Revenue trend</h2>
              <span className="text-sm text-muted">Last 6 months</span>
            </div>
            <div className="h-40">
              <Sparkline data={revenueChart} color="#0F766E" height={160} />
            </div>
            <p className="mt-2 text-sm text-muted">Income booked month by month</p>
          </div>
        </Reveal>

        <Reveal delay={250}>
          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-heading text-lg font-semibold text-navy">Net profit trend</h2>
              <span className="text-sm text-muted">Last 6 months</span>
            </div>
            <div className="h-40">
              <Sparkline data={netChart} color="#102A43" height={160} />
            </div>
            <p className="mt-2 text-sm text-muted">Net profit = revenue − costs − refunds</p>
          </div>
        </Reveal>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Reveal delay={300}>
            <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-heading text-lg font-semibold text-navy">Patient pipeline</h2>
                <Link href="/admin/patients" className="text-sm font-medium text-teal hover:text-navy">Manage all</Link>
              </div>
              <div className="overflow-hidden rounded-xl border border-border">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-border bg-warm-white text-muted">
                    <tr>
                      <th className="px-4 py-3 font-medium">Patient</th>
                      <th className="px-4 py-3 font-medium">Stage</th>
                      <th className="px-4 py-3 font-medium">Country</th>
                      <th className="px-4 py-3 font-medium">Submitted</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {casesList.map((row) => (
                      <tr key={row.id} className="transition-colors hover:bg-warm-white">
                        <td className="px-4 py-3 text-dark">{row.dv_profiles?.name || "—"}</td>
                        <td className="px-4 py-3"><Badge tone="info">{row.status}</Badge></td>
                        <td className="px-4 py-3 text-muted">{row.dv_profiles?.country || row.country || "—"}</td>
                        <td className="px-4 py-3 text-muted">{formatDate(row.created_at)}</td>
                      </tr>
                    ))}
                    {casesList.length === 0 && (
                      <tr>
                        <td className="px-4 py-3 text-muted" colSpan={4}>No cases yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </Reveal>

          <Reveal delay={350}>
            <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-heading text-lg font-semibold text-navy">Quick links</h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
                <QuickLink href="/admin/patients" icon={Users} label="Patients" />
                <QuickLink href="/admin/doctors" icon={Stethoscope} label="Doctors" />
                <QuickLink href="/admin/hospitals" icon={Building2} label="Hospitals" />
                <QuickLink href="/admin/packages" icon={Package} label="Packages" />
                <QuickLink href="/admin/appointments" icon={Calendar} label="Appointments" />
                <QuickLink href="/admin/orders" icon={ShoppingCart} label="Orders" />
                <QuickLink href="/admin/finance" icon={Banknote} label="Finance" />
                <QuickLink href="/admin/support" icon={HeadphonesIcon} label="Support" />
              </div>
            </div>
          </Reveal>
        </div>

        <div className="space-y-6">
          <Reveal delay={350}>
            <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-heading text-lg font-semibold text-navy">Recent transactions</h2>
                <Link href="/admin/finance" className="text-sm font-medium text-teal hover:text-navy">View all</Link>
              </div>
              {recentTransactions.length === 0 ? (
                <p className="text-sm text-muted">No transactions yet.</p>
              ) : (
                <ul className="space-y-3">
                  {recentTransactions.map((tx) => (
                    <li key={tx.id} className="flex items-center justify-between rounded-xl bg-warm-white px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-dark">{tx.type}</p>
                        <p className="text-xs text-muted">{recentProfileMap.get(tx.patient_id || "") || "—"} · {new Date(tx.created_at).toLocaleDateString()}</p>
                      </div>
                      <span className={`text-sm font-semibold ${tx.type === "income" ? "text-teal" : tx.type === "refund" ? "text-red-600" : "text-navy"}`}>
                        {tx.type === "cost" ? "−" : "+"}{formatAmount(Number(tx.amount), tx.currency || "USD")}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Reveal>

          <Reveal delay={400}>
            <ActivityFeed items={activity} title="Recent activity" />
          </Reveal>
        </div>
      </div>
    </div>
  );
}


