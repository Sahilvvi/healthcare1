import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import { supabaseAdmin } from "@/app/lib/supabase/admin";
import type { MedicineOrder } from "@/app/lib/types";
import { OrderActions } from "./OrderActions";

export default async function AdminOrdersPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("dv_profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = (profile as { role?: string } | null)?.role;
  if (role !== "admin" && role !== "doctor") {
    redirect("/patient/dashboard");
  }

  const { data: ordersData } = await supabaseAdmin
    .from("dv_medicine_orders")
    .select("*, dv_profiles(name)")
    .order("created_at", { ascending: false });

  const orders: (MedicineOrder & { dv_profiles?: { name: string } | null })[] =
    (ordersData as (MedicineOrder & { dv_profiles?: { name: string } | null })[]) || [];

  function formatItems(items: unknown): string {
    if (Array.isArray(items)) return items.map(String).join(", ");
    if (typeof items === "string") return items;
    return JSON.stringify(items);
  }

  return (
    <section>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-semibold text-navy">Medicine orders</h1>
        <p className="text-sm text-muted">Track prescriptions, packing and delivery status</p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-warm-white text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Order ID</th>
              <th className="px-4 py-3 font-medium">Patient</th>
              <th className="px-4 py-3 font-medium">Items</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-4 py-3 font-medium text-dark">{order.id.slice(0, 8).toUpperCase()}</td>
                <td className="px-4 py-3 text-muted">{order.dv_profiles?.name || "—"}</td>
                <td className="px-4 py-3 text-muted">{formatItems(order.items)}</td>
                <td className="px-4 py-3">
                  <OrderActions orderId={order.id} currentStatus={order.status || "PENDING"} />
                </td>
                <td className="px-4 py-3 text-muted">{order.total || "—"}</td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td className="px-4 py-3 text-muted" colSpan={5}>
                  No orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
