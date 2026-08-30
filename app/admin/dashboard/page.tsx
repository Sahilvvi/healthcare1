import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import { supabaseAdmin } from "@/app/lib/supabase/admin";
import { StatCard } from "@/app/components/dashboard/StatCard";
import { SectionHeader } from "@/app/components/dashboard/SectionHeader";
import { Badge } from "@/app/components/dashboard/Badge";
import { ActivityFeed } from "@/app/components/dashboard/ActivityFeed";
import { buildActivityFeed } from "@/app/lib/activity";
import { isAdmin } from "@/app/lib/roles";
import type { Case, Profile, Transaction } from "@/app/lib/types";

function formatDate(ts: string) {
  return new Date(ts).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function formatAmount(amount: number, currency: string) {
  return `${currency} ${amount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
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
    { data: cases },
    { data: transactionsData },
  ] = await Promise.all([
    supabaseAdmin.from("dv_profiles").select("*", { count: "exact", head: true }).eq("role", "patient"),
    supabaseAdmin.from("dv_cases").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("dv_appointments").select("*", { count: "exact", head: true }).gte("scheduled_at", todayStart).lte("scheduled_at", todayEnd),
    supabaseAdmin.from("dv_medicine_orders").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("dv_support_tickets").select("*", { count: "exact", head: true }).eq("status", "OPEN"),
    supabaseAdmin.from("dv_cases").select("*, dv_profiles(name, country)").order("created_at", { ascending: false }).limit(20),
    supabaseAdmin.from("dv_transactions").select("*").order("created_at", { ascending: false }).limit(100),
  ]);

  const casesList: (Case & { dv_profiles?: Profile | null })[] = (cases as (Case & { dv_profiles?: Profile | null })[]) || [];
  const transactions: Transaction[] = (transactionsData || []) as Transaction[];
  const revenue = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + Number(t.amount), 0);

  const activity = buildActivityFeed({ cases: casesList, transactions: transactions.slice(0, 10) });

  return (
    <div className="space-y-8">
      <SectionHeader title="Admin dashboard" subtitle="International patient operations, finance and support" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="International patients" value={patientCount ?? 0} href="/admin/patients" />
        <StatCard label="Active cases" value={activeCaseCount ?? 0} href="/admin/patients" />
        <StatCard label="Today's consultations" value={todayConsultCount ?? 0} href="/admin/appointments" />
        <StatCard label="Medicine orders" value={orderCount ?? 0} href="/admin/orders" />
        <StatCard label="Open tickets" value={ticketCount ?? 0} href="/admin/support" />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
          <p className="text-sm text-muted">Total revenue</p>
          <p className="mt-2 font-heading text-2xl font-semibold text-navy">{formatAmount(revenue, "USD")}</p>
        </div>
        <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
          <p className="text-sm text-muted">Avg. transaction</p>
          <p className="mt-2 font-heading text-2xl font-semibold text-navy">{formatAmount(transactions.length ? revenue / transactions.length : 0, "USD")}</p>
        </div>
        <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
          <p className="text-sm text-muted">Transactions</p>
          <p className="mt-2 font-heading text-2xl font-semibold text-navy">{transactions.length}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-white p-6 shadow-sm lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold text-navy">Patient pipeline</h2>
            <Link href="/admin/patients" className="text-sm font-medium text-teal hover:text-navy">Manage</Link>
          </div>
          <div className="overflow-hidden rounded-lg border border-border">
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
                  <tr key={row.id}>
                    <td className="px-4 py-3 text-dark">{row.dv_profiles?.name || "—"}</td>
                    <td className="px-4 py-3"><Badge tone="info">{row.status}</Badge></td>
                    <td className="px-4 py-3 text-muted">{row.dv_profiles?.country || row.country || "—"}</td>
                    <td className="px-4 py-3 text-muted">{formatDate(row.created_at)}</td>
                  </tr>
                ))}
                {casesList.length === 0 && <tr><td className="px-4 py-3 text-muted" colSpan={4}>No cases yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        <ActivityFeed items={activity} title="Recent activity" />
      </div>
    </div>
  );
}
