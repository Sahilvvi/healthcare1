import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import { SectionHeader } from "@/app/components/dashboard/SectionHeader";
import { Badge } from "@/app/components/dashboard/Badge";
import { EmptyState } from "@/app/components/dashboard/EmptyState";
import type { MedicineOrder } from "@/app/lib/types";

function formatDate(ts: string) {
  return new Date(ts).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

const statusTone: Record<string, "default" | "warning" | "success" | "info"> = {
  PENDING: "warning",
  PACKING: "info",
  OUT_FOR_DELIVERY: "info",
  DELIVERED: "success",
};

export default async function MedicinesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: ordersData } = await supabase
    .from("dv_medicine_orders")
    .select("*")
    .eq("patient_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  const orders: MedicineOrder[] = (ordersData as MedicineOrder[]) || [];
  const latest = orders[0];

  const tracking = latest
    ? [
        { label: "Prescription received", done: true },
        { label: "Order packed", done: ["PACKING", "OUT_FOR_DELIVERY", "DELIVERED"].includes(latest.status) },
        { label: "Out for delivery", done: ["OUT_FOR_DELIVERY", "DELIVERED"].includes(latest.status) },
        { label: "Delivered", done: latest.status === "DELIVERED" },
      ]
    : [];

  return (
    <div className="space-y-8">
      <SectionHeader title="Medicines" subtitle="Prescriptions, orders and delivery tracking" />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-white p-6 shadow-sm lg:col-span-1">
          <h2 className="font-heading text-lg font-semibold text-navy">Latest order</h2>
          {latest ? (
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-dark">Order {latest.id.slice(0, 8)}</p>
                <Badge tone={statusTone[latest.status] || "default"}>{latest.status}</Badge>
              </div>
              <p className="mt-1 text-sm text-muted">Placed on {formatDate(latest.created_at)}</p>

              {tracking.length > 0 && (
                <div className="mt-6 space-y-0">
                  {tracking.map((step, i) => (
                    <div key={step.label} className="relative flex gap-4 pb-8 last:pb-0">
                      <div className="flex flex-col items-center">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${step.done ? "bg-teal text-white" : "bg-sage text-muted"}`}>
                          {step.done ? "✓" : i + 1}
                        </div>
                        {i < tracking.length - 1 && <div className="mt-2 h-full w-px bg-border" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-dark">{step.label}</p>
                        <p className="text-xs text-muted">{step.done ? "Done" : "Pending"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <EmptyState title="No orders" subtitle="Your medicine orders will appear here once a prescription is added." />
          )}
        </div>

        <div className="rounded-xl border border-border bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="font-heading text-lg font-semibold text-navy">Order history</h2>
          {orders.length === 0 ? (
            <p className="mt-4 text-sm text-muted">No medicine orders yet.</p>
          ) : (
            <div className="mt-4 overflow-hidden rounded-lg border border-border">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border bg-warm-white text-muted">
                  <tr>
                    <th className="px-4 py-3 font-medium">Order</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {orders.map((order) => {
                    const total = Array.isArray(order.items)
                      ? (order.items as { price?: number; qty?: number }[]).reduce((sum, it) => sum + (Number(it.price) || 0) * (Number(it.qty) || 1), 0)
                      : 0;
                    return (
                      <tr key={order.id}>
                        <td className="px-4 py-3 text-dark">{order.id.slice(0, 8)}</td>
                        <td className="px-4 py-3"><Badge tone={statusTone[order.status] || "default"}>{order.status}</Badge></td>
                        <td className="px-4 py-3 text-muted">{formatDate(order.created_at)}</td>
                        <td className="px-4 py-3 text-dark">USD {total.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
        <h2 className="font-heading text-lg font-semibold text-navy">Prescription details</h2>
        <p className="mt-2 text-sm text-muted">When your doctor issues a prescription, the medicines, dosage and instructions will appear here. You can confirm the order and track delivery.</p>
        <Link href="/patient/prescriptions" className="mt-4 inline-block text-sm font-medium text-teal hover:text-navy">
          View prescriptions →
        </Link>
      </div>
    </div>
  );
}
