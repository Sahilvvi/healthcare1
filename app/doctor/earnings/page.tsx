import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import { supabaseAdmin } from "@/app/lib/supabase/admin";
import { SectionHeader } from "@/app/components/dashboard/SectionHeader";
import { StatCard } from "@/app/components/dashboard/StatCard";
import { Badge } from "@/app/components/dashboard/Badge";
import { Sparkline } from "@/app/components/ui/Sparkline";
import { isDoctor } from "@/app/lib/roles";
import type { Transaction } from "@/app/lib/types";
import { TrendingUp, TrendingDown, Wallet, Banknote } from "lucide-react";

function formatDate(ts: string) {
  return new Date(ts).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function formatAmount(amount: number, currency: string) {
  return `${currency} ${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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

export default async function DoctorEarningsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("dv_profiles").select("role").eq("id", user.id).single();
  if (!isDoctor(profile?.role)) redirect("/login");

  const { data: doctor } = await supabaseAdmin.from("dv_doctors").select("id").eq("user_id", user.id).single();

  let query = supabaseAdmin.from("dv_transactions").select("*").order("created_at", { ascending: false }).limit(100);
  if (doctor) query = query.eq("doctor_id", doctor.id);

  const { data } = await query;
  const transactions: Transaction[] = (data || []) as Transaction[];

  const income = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + Number(t.amount), 0);
  const cost = transactions.filter((t) => t.type === "cost").reduce((sum, t) => sum + Number(t.amount), 0);
  const refund = transactions.filter((t) => t.type === "refund").reduce((sum, t) => sum + Number(t.amount), 0);
  const net = income - cost - refund;

  const incomeChart = monthlySeries(transactions, "income");
  const netChart = incomeChart.map((r, i) => r - monthlySeries(transactions, "cost")[i] - monthlySeries(transactions, "refund")[i]);

  return (
    <div className="space-y-8">
      <SectionHeader title="Earnings" subtitle="Consultation income, deductions and payouts" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total income" value={formatAmount(income, "USD")} icon={TrendingUp} changeType="positive" />
        <StatCard label="Deductions" value={formatAmount(cost, "USD")} icon={TrendingDown} changeType="negative" />
        <StatCard label="Refunds" value={formatAmount(refund, "USD")} icon={Wallet} />
        <StatCard label="Net earnings" value={formatAmount(net, "USD")} icon={Banknote} />
      </div>

      <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold text-navy">Earnings trend</h2>
          <span className="text-sm text-muted">Last 6 months</span>
        </div>
        <div className="h-48">
          <Sparkline data={netChart} color="#0F766E" height={180} />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-warm-white text-muted">
            <tr>
              <th className="px-5 py-3 font-medium">Date</th>
              <th className="px-5 py-3 font-medium">Description</th>
              <th className="px-5 py-3 font-medium">Category</th>
              <th className="px-5 py-3 font-medium">Type</th>
              <th className="px-5 py-3 font-medium text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {transactions.map((t) => (
              <tr key={t.id} className="transition-colors hover:bg-warm-white">
                <td className="px-5 py-4 text-muted">{formatDate(t.created_at)}</td>
                <td className="px-5 py-4 text-dark">{t.description || "—"}</td>
                <td className="px-5 py-4 text-muted">{t.category || "—"}</td>
                <td className="px-5 py-4"><Badge tone={t.type === "income" ? "success" : t.type === "refund" ? "warning" : "default"}>{t.type}</Badge></td>
                <td className="px-5 py-4 text-right font-medium text-navy">{formatAmount(Number(t.amount), t.currency)}</td>
              </tr>
            ))}
            {transactions.length === 0 && <tr><td className="px-5 py-4 text-muted" colSpan={5}>No earnings recorded yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
