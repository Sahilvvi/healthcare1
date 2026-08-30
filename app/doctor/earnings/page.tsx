import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import { supabaseAdmin } from "@/app/lib/supabase/admin";
import { SectionHeader } from "@/app/components/dashboard/SectionHeader";
import { StatCard } from "@/app/components/dashboard/StatCard";
import { Badge } from "@/app/components/dashboard/Badge";
import { isDoctor } from "@/app/lib/roles";
import type { Transaction } from "@/app/lib/types";

function formatDate(ts: string) {
  return new Date(ts).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function formatAmount(amount: number, currency: string) {
  return `${currency} ${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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

  return (
    <div className="space-y-8">
      <SectionHeader title="Earnings" subtitle="Consultation income, deductions and payouts" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total income" value={formatAmount(income, "USD")} />
        <StatCard label="Deductions" value={formatAmount(cost, "USD")} />
        <StatCard label="Refunds" value={formatAmount(refund, "USD")} />
        <StatCard label="Net earnings" value={formatAmount(net, "USD")} />
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
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
              <tr key={t.id}>
                <td className="px-5 py-4 text-muted">{formatDate(t.created_at)}</td>
                <td className="px-5 py-4 text-dark">{t.description || "—"}</td>
                <td className="px-5 py-4 text-muted">{t.category || "—"}</td>
                <td className="px-5 py-4"><Badge tone={t.type === "income" ? "success" : t.type === "refund" ? "warning" : "default"}>{t.type}</Badge></td>
                <td className="px-5 py-4 text-right font-medium text-navy">{formatAmount(t.amount, t.currency)}</td>
              </tr>
            ))}
            {transactions.length === 0 && <tr><td className="px-5 py-4 text-muted" colSpan={5}>No earnings recorded yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
