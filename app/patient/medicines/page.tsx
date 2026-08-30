import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import type { MedicineOrder } from "@/app/lib/types";

export default async function MedicinesPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const { data: ordersData } = await supabase
    .from("dv_medicine_orders")
    .select("*")
    .eq("patient_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10);

  const orders: MedicineOrder[] = (ordersData as MedicineOrder[]) || [];
  const latest = orders[0];

  const rawItems = Array.isArray(latest?.items) ? latest.items : [];
  const items = rawItems.map((it) => {
    if (typeof it === "string") {
      const [name, dosage, qty] = it.split(" — ");
      return { name: name || it, dosage: dosage || "", qty: qty || "" };
    }
    const obj = it as { name?: string; qty?: string; dosage?: string };
    return { name: obj.name || "Medicine", dosage: obj.dosage || "", qty: obj.qty || "" };
  });

  const tracking = latest
    ? [
        { label: "Prescription received", done: true },
        { label: "Order packed", done: ["PACKING", "OUT_FOR_DELIVERY", "DELIVERED"].includes(latest.status) },
        { label: "Out for delivery", done: ["OUT_FOR_DELIVERY", "DELIVERED"].includes(latest.status) },
        { label: "Delivered", done: latest.status === "DELIVERED" },
      ]
    : [];

  return (
    <section className="bg-warm-white py-10 lg:py-16">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <Link href="/patient/dashboard" className="text-sm text-muted hover:text-teal">
          ← Back to dashboard
        </Link>

        <h1 className="mt-6 font-heading text-3xl font-semibold text-navy">Medicines</h1>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-border bg-white p-6 shadow-sm">
            <h2 className="font-heading text-lg font-semibold text-navy">Latest prescription</h2>
            {items.length > 0 ? (
              <div className="mt-6 space-y-3">
                {items.map((med, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-md border border-border p-4"
                  >
                    <div>
                      <p className="font-medium text-dark">{med.name || "Medicine"}</p>
                      <p className="text-sm text-muted">{med.dosage || ""}</p>
                    </div>
                    <span className="text-sm text-muted">{med.qty || ""}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-6 text-sm text-muted">No prescriptions yet.</p>
            )}
          </div>

          <div className="rounded-lg border border-border bg-white p-6 shadow-sm">
            <h2 className="font-heading text-lg font-semibold text-navy">Order tracking</h2>
            {latest ? (
              <div className="mt-6 space-y-0">
                {tracking.map((step, i) => (
                  <div key={step.label} className="relative flex gap-4 pb-8 last:pb-0">
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                          step.done ? "bg-teal text-white" : "bg-sage text-muted"
                        }`}
                      >
                        {step.done ? "✓" : i + 1}
                      </div>
                      {i < tracking.length - 1 && (
                        <div className="mt-2 h-full w-px bg-border" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-dark">{step.label}</p>
                      <p className="text-sm text-muted">{step.done ? "Done" : "Pending"}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-6 text-sm text-muted">No medicine orders yet.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
