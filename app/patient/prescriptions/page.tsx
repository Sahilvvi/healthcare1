import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import { SectionHeader } from "@/app/components/dashboard/SectionHeader";
import { EmptyState } from "@/app/components/dashboard/EmptyState";
import { Badge } from "@/app/components/dashboard/Badge";
import type { Prescription } from "@/app/lib/types";

function formatDate(ts: string) {
  return new Date(ts).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default async function PatientPrescriptionsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data } = await supabase
    .from("dv_prescriptions")
    .select("*")
    .eq("patient_id", user.id)
    .order("created_at", { ascending: false });

  const prescriptions: Prescription[] = (data || []) as Prescription[];

  return (
    <div className="space-y-6">
      <SectionHeader title="Prescriptions" subtitle="Medications and notes from your doctor" />

      {prescriptions.length === 0 ? (
        <EmptyState title="No prescriptions" subtitle="Your doctor will add prescriptions after consultation." />
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {prescriptions.map((rx) => (
            <div key={rx.id} className="rounded-xl border border-border bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-lg font-semibold text-navy">
                  Prescription {rx.id.slice(0, 8)}
                </h2>
                <Badge tone={rx.status === "ACTIVE" ? "success" : "default"}>{rx.status}</Badge>
              </div>
              <p className="mt-1 text-xs text-muted">{formatDate(rx.created_at)}</p>

              {rx.medications && rx.medications.length > 0 && (
                <ul className="mt-4 space-y-3">
                  {rx.medications.map((med, i) => (
                    <li key={i} className="rounded-lg bg-warm-white p-3 text-sm">
                      <p className="font-medium text-dark">{med.name}</p>
                      <p className="text-muted">{med.dosage} · {med.frequency} · {med.duration}</p>
                    </li>
                  ))}
                </ul>
              )}

              {rx.notes && (
                <div className="mt-4 border-t border-border pt-4">
                  <p className="text-sm font-medium text-dark">Notes</p>
                  <p className="text-sm text-muted">{rx.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
