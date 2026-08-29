import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import { supabaseAdmin } from "@/app/lib/supabase/admin";
import type { MedicineOrder } from "@/app/lib/types";

interface MedicineOrderWithProfile extends MedicineOrder {
  dv_profiles?: { name: string } | null;
}

export default async function DoctorPrescriptionsPage() {
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
  if (role !== "doctor" && role !== "admin") {
    redirect("/patient/dashboard");
  }

  const { data: ordersData } = await supabaseAdmin
    .from("dv_medicine_orders")
    .select("*, dv_profiles(name)")
    .order("created_at", { ascending: false })
    .limit(50);

  const orders: MedicineOrderWithProfile[] =
    (ordersData as MedicineOrderWithProfile[]) || [];

  function formatItems(items: unknown): string {
    if (Array.isArray(items)) return items.map(String).join(", ");
    if (typeof items === "string") return items;
    return "—";
  }

  return (
    <section className="bg-warm-white py-10 lg:py-16">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-3xl font-semibold text-navy md:text-4xl">
              Prescriptions
            </h1>
            <p className="mt-2 text-muted">Manage and review patient prescriptions.</p>
          </div>
          <Link href="/doctor/dashboard" className="text-sm font-medium text-teal hover:text-navy">
            Back to dashboard
          </Link>
        </div>

        <div className="rounded-lg border border-border bg-white p-6 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border text-muted">
                <tr>
                  <th className="py-3 font-medium">Patient</th>
                  <th className="py-3 font-medium">Items</th>
                  <th className="py-3 font-medium">Status</th>
                  <th className="py-3 font-medium">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders.map((p) => (
                  <tr key={p.id}>
                    <td className="py-4 text-dark">{p.dv_profiles?.name || "—"}</td>
                    <td className="py-4 text-muted">{formatItems(p.items)}</td>
                    <td className="py-4">
                      <span className="rounded-full bg-sage px-2.5 py-1 text-xs text-dark">{p.status}</span>
                    </td>
                    <td className="py-4 text-muted">{p.total || "—"}</td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td className="py-4 text-muted" colSpan={4}>No prescriptions yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
