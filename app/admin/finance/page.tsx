import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import { supabaseAdmin } from "@/app/lib/supabase/admin";
import { SectionHeader } from "@/app/components/dashboard/SectionHeader";
import { StatCard } from "@/app/components/dashboard/StatCard";
import { Badge } from "@/app/components/dashboard/Badge";
import { Sparkline } from "@/app/components/ui/Sparkline";
import { isAdmin } from "@/app/lib/roles";
import type { Transaction } from "@/app/lib/types";
import { AddTransactionForm } from "./AddTransactionForm";
import { TrendingUp, TrendingDown, Wallet, Banknote } from "lucide-react";

function formatAmount(amount: number, currency = "USD") {
  return `${currency} ${amount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

function formatDate(ts: string) {
  return new Date(ts).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
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

export default async function AdminFinancePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("dv_profiles").select("role").eq("id", user.id).single();
  if (!isAdmin(profile?.role)) redirect("/login");

  const { data } = await supabaseAdmin.from("dv_transactions").select("*").order("created_at", { ascending: false }).limit(200);
  const transactions: Transaction[] = (data || []) as Transaction[];

  const income = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + Number(t.amount), 0);
  const costs = transactions.filter((t) => t.type === "cost").reduce((sum, t) => sum + Number(t.amount), 0);
  const refunds = transactions.filter((t) => t.type === "refund").reduce((sum, t) => sum + Number(t.amount), 0);
  const net = income - costs - refunds;
  const margin = income > 0 ? ((net / income) * 100).toFixed(1) : "0.0";

  const incomeChart = monthlySeries(transactions, "income");
  const costChart = monthlySeries(transactions, "cost");
  const netChart = incomeChart.map((r, i) => r - costChart[i] - monthlySeries(transactions, "refund")[i]);

  return (
    <div className="space-y-8">
      <SectionHeader title="Finance" subtitle="Revenue, costs, profit and payout summary" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Revenue" value={formatAmount(income, "USD")} icon={TrendingUp} changeType="positive" />
        <StatCard label="Costs" value={formatAmount(costs, "USD")} icon={TrendingDown} changeType="negative" />
        <StatCard label="Refunds" value={formatAmount(refunds, "USD")} icon={Wallet} />
        <StatCard label="Net profit" value={formatAmount(net, "USD")} icon={Banknote} subtext={`${margin}% margin`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold text-navy">Financial trends</h2>
            <span className="text-sm text-muted">Last 6 months</span>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            <div>
              <p className="text-xs font-medium uppercase text-muted">Revenue</p>
              <div className="mt-2 h-24">
                <Sparkline data={incomeChart} color="#0F766E" height={90} />
              </div>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-muted">Costs</p>
              <div className="mt-2 h-24">
                <Sparkline data={costChart} color="#102A43" height={90} />
              </div>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-muted">Net</p>
              <div className="mt-2 h-24">
                <Sparkline data={netChart} color="#667085" height={90} />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <h2 className="font-heading text-lg font-semibold text-navy">Record transaction</h2>
          <AddTransactionForm />
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
            {transactions.length === 0 && <tr><td className="px-5 py-4 text-muted" colSpan={5}>No transactions yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
