import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import { supabaseAdmin } from "@/app/lib/supabase/admin";
import { SectionHeader } from "@/app/components/dashboard/SectionHeader";
import { Badge } from "@/app/components/dashboard/Badge";
import { isDoctor } from "@/app/lib/roles";
import type { Prescription } from "@/app/lib/types";
import { PrescriptionForm } from "./PrescriptionForm";

function formatDate(ts: string) {
  return new Date(ts).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default async function DoctorPrescriptionsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("dv_profiles").select("role").eq("id", user.id).single();
  if (!isDoctor(profile?.role)) redirect("/login");

  const [{ data: prescriptions }, { data: cases }] = await Promise.all([
    supabaseAdmin.from("dv_prescriptions").select("*").eq("doctor_id", user.id).order("created_at", { ascending: false }).limit(50),
    supabaseAdmin.from("dv_cases").select("id, category, patient_id").order("created_at", { ascending: false }).limit(50),
  ]);

  const list: Prescription[] = (prescriptions || []) as Prescription[];

  const patientIds = Array.from(new Set(list.map((rx) => rx.patient_id).filter(Boolean))) as string[];
  const { data: profiles } = patientIds.length
    ? await supabaseAdmin.from("dv_profiles").select("id, name").in("id", patientIds)
    : { data: [] };
  const profileMap = new Map((profiles || []).map((p: { id: string; name: string }) => [p.id, p.name]));

  return (
    <div className="space-y-8">
      <SectionHeader title="Prescriptions" subtitle="Write, review and manage patient prescriptions" />

      <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
        <h2 className="font-heading text-lg font-semibold text-navy">New prescription</h2>
        <PrescriptionForm cases={cases || []} />
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-warm-white text-muted">
            <tr>
              <th className="px-5 py-3 font-medium">Patient</th>
              <th className="px-5 py-3 font-medium">Medications</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {list.map((rx) => (
              <tr key={rx.id}>
                <td className="px-5 py-4 text-dark">{profileMap.get(rx.patient_id) || "—"}</td>
                <td className="px-5 py-4 text-muted">
                  {rx.medications?.map((m) => `${m.name} ${m.dosage}`).join(", ") || "—"}
                </td>
                <td className="px-5 py-4"><Badge tone={rx.status === "ACTIVE" ? "success" : "default"}>{rx.status}</Badge></td>
                <td className="px-5 py-4 text-muted">{formatDate(rx.created_at)}</td>
              </tr>
            ))}
            {list.length === 0 && <tr><td className="px-5 py-4 text-muted" colSpan={4}>No prescriptions yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
