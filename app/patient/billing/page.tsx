import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import { SectionHeader } from "@/app/components/dashboard/SectionHeader";
import { EmptyState } from "@/app/components/dashboard/EmptyState";
import { Badge } from "@/app/components/dashboard/Badge";
import type { Transaction } from "@/app/lib/types";

function formatDate(ts: string) {
  return new Date(ts).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function formatAmount(amount: number, currency: string) {
  return `${currency} ${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default async function PatientBillingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data } = await supabase
    .from("dv_transactions")
    .select("*")
    .eq("patient_id", user.id)
    .order("created_at", { ascending: false });

  const transactions: Transaction[] = (data || []) as Transaction[];
  const totalPaid = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + Number(t.amount), 0);
  const totalRefunded = transactions.filter((t) => t.type === "refund").reduce((sum, t) => sum + Number(t.amount), 0);
  const totalCosts = transactions.filter((t) => t.type === "cost").reduce((sum, t) => sum + Number(t.amount), 0);

  return (
    <div className="space-y-6">
      <SectionHeader title="Billing" subtitle="Invoices, payments and refunds" />

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
          <p className="text-sm text-muted">Total paid</p>
          <p className="mt-2 font-heading text-2xl font-semibold text-navy">{formatAmount(totalPaid, "USD")}</p>
        </div>
        <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
          <p className="text-sm text-muted">Refunds</p>
          <p className="mt-2 font-heading text-2xl font-semibold text-navy">{formatAmount(totalRefunded, "USD")}</p>
        </div>
        <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
          <p className="text-sm text-muted">Adjustments</p>
          <p className="mt-2 font-heading text-2xl font-semibold text-navy">{formatAmount(totalCosts, "USD")}</p>
        </div>
      </div>

      {transactions.length === 0 ? (
        <EmptyState title="No transactions" subtitle="Your billing history will appear here." />
      ) : (
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
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
