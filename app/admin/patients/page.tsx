import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import { supabaseAdmin } from "@/app/lib/supabase/admin";
import type { Case, Profile } from "@/app/lib/types";
import { CaseActions } from "./CaseActions";
import { AssignCoordinator } from "./AssignCoordinator";

const stages = ["New", "Medical Review", "Consultation", "Plan", "Treatment", "Recovery"];

export default async function AdminPatientsPage() {
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

  const { data: patients } = await supabaseAdmin
    .from("dv_profiles")
    .select("*")
    .eq("role", "patient")
    .order("created_at", { ascending: false });

  const { data: cases } = await supabaseAdmin
    .from("dv_cases")
    .select("*")
    .order("created_at", { ascending: false });

  const casesMap = new Map((cases || []).map((c: Case) => [c.patient_id, c]));

  const { data: coordinatorsData } = await supabaseAdmin
    .from("dv_profiles")
    .select("id, name")
    .eq("role", "admin");

  const coordinators = (coordinatorsData || []) as { id: string; name: string }[];

  return (
    <section>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-semibold text-navy">Patients</h1>
        <p className="text-sm text-muted">International patient pipeline and case assignments</p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-warm-white text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Patient</th>
              <th className="px-4 py-3 font-medium">Country</th>
              <th className="px-4 py-3 font-medium">Case</th>
              <th className="px-4 py-3 font-medium">Stage</th>
              <th className="px-4 py-3 font-medium">Coordinator</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {(patients as Profile[] || []).map((patient) => {
              const patientCase = casesMap.get(patient.id);
              return (
                <tr key={patient.id}>
                  <td className="px-4 py-3 font-medium text-dark">{patient.name}</td>
                  <td className="px-4 py-3 text-muted">{patient.country || "—"}</td>
                  <td className="px-4 py-3 text-muted">{patientCase?.category || "—"}</td>
                  <td className="px-4 py-3">
                    {patientCase ? (
                      <CaseActions caseId={patientCase.id} currentStatus={patientCase.status || "NEW"} />
                    ) : (
                      <span className="rounded-full bg-sage px-2.5 py-1 text-xs text-dark">NEW</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {patientCase ? (
                      <AssignCoordinator
                        caseId={patientCase.id}
                        current={patientCase.coordinator_id || ""}
                        coordinators={coordinators}
                      />
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              );
            })}
            {(!patients || patients.length === 0) && (
              <tr>
                <td className="px-4 py-3 text-muted" colSpan={5}>
                  No patients yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-8 rounded-lg border border-border bg-white p-6 shadow-sm">
        <h2 className="font-heading text-lg font-semibold text-navy">Pipeline</h2>
        <div className="mt-4 flex items-center justify-between overflow-x-auto">
          {stages.map((stage, i) => (
            <div key={stage} className="flex items-center">
              <div className="whitespace-nowrap rounded-md border border-border bg-warm-white px-4 py-2 text-sm font-medium text-dark">
                {stage}
              </div>
              {i < stages.length - 1 && <div className="mx-2 h-px w-6 bg-border" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
