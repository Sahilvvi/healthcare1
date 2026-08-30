import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import { supabaseAdmin } from "@/app/lib/supabase/admin";
import { SectionHeader } from "@/app/components/dashboard/SectionHeader";
import { Badge } from "@/app/components/dashboard/Badge";
import { isAdmin } from "@/app/lib/roles";
import type { Case, Profile } from "@/app/lib/types";
import { CaseActions } from "./CaseActions";
import { AssignCoordinator } from "./AssignCoordinator";

export default async function AdminPatientsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("dv_profiles").select("role").eq("id", user.id).single();
  if (!isAdmin(profile?.role)) redirect("/login");

  const [{ data: patients }, { data: cases }, { data: coordinatorsData }] = await Promise.all([
    supabaseAdmin.from("dv_profiles").select("*").eq("role", "patient").order("created_at", { ascending: false }),
    supabaseAdmin.from("dv_cases").select("*").order("created_at", { ascending: false }),
    supabaseAdmin.from("dv_profiles").select("id, name").in("role", ["admin", "superadmin"]),
  ]);

  const casesMap = new Map((cases || []).map((c: Case) => [c.patient_id, c]));
  const coordinators = (coordinatorsData || []) as { id: string; name: string }[];

  return (
    <div className="space-y-6">
      <SectionHeader title="Patients" subtitle="International patient pipeline and case assignments" />

      <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-warm-white text-muted">
            <tr>
              <th className="px-5 py-3 font-medium">Patient</th>
              <th className="px-5 py-3 font-medium">Country</th>
              <th className="px-5 py-3 font-medium">Case</th>
              <th className="px-5 py-3 font-medium">Stage</th>
              <th className="px-5 py-3 font-medium">Coordinator</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {(patients as Profile[] || []).map((patient) => {
              const patientCase = casesMap.get(patient.id);
              return (
                <tr key={patient.id}>
                  <td className="px-5 py-4 font-medium text-dark">{patient.name}</td>
                  <td className="px-5 py-4 text-muted">{patient.country || "—"}</td>
                  <td className="px-5 py-4 text-muted">{patientCase?.category || "—"}</td>
                  <td className="px-5 py-4">
                    {patientCase ? (
                      <CaseActions caseId={patientCase.id} currentStatus={patientCase.status || "NEW"} />
                    ) : (
                      <Badge tone="default">NEW</Badge>
                    )}
                  </td>
                  <td className="px-5 py-4 text-muted">
                    {patientCase ? (
                      <AssignCoordinator caseId={patientCase.id} current={patientCase.coordinator_id || ""} coordinators={coordinators} />
                    ) : "—"}
                  </td>
                </tr>
              );
            })}
            {(!patients || patients.length === 0) && (
              <tr><td className="px-5 py-4 text-muted" colSpan={5}>No patients yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
