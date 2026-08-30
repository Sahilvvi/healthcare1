import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import { SectionHeader } from "@/app/components/dashboard/SectionHeader";
import { Badge } from "@/app/components/dashboard/Badge";
import { EmptyState } from "@/app/components/dashboard/EmptyState";
import type { Case, CaseTimeline, Appointment, Prescription, Doctor, Hospital, Package } from "@/app/lib/types";

function formatDate(ts: string) {
  return new Date(ts).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default async function PatientCarePlanPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: cases } = await supabase
    .from("dv_cases")
    .select("*")
    .eq("patient_id", user.id)
    .order("created_at", { ascending: false });

  const activeCase: Case | undefined = (cases || [])[0];
  const caseIds = (cases || []).map((c) => c.id);

  const [timelineResult, appointmentsResult, prescriptionsResult, doctorsResult, hospitalsResult, packagesResult] =
    await Promise.all([
      activeCase
        ? supabase.from("dv_case_timeline").select("*").eq("case_id", activeCase.id).order("created_at", { ascending: true })
        : Promise.resolve({ data: [] }),
      caseIds.length
        ? supabase.from("dv_appointments").select("*, dv_doctors(name, specialty)").in("case_id", caseIds).order("scheduled_at", { ascending: true })
        : Promise.resolve({ data: [] }),
      caseIds.length
        ? supabase.from("dv_prescriptions").select("*").in("case_id", caseIds).order("created_at", { ascending: false })
        : Promise.resolve({ data: [] }),
      activeCase?.category
        ? supabase.from("dv_doctors").select("*").ilike("specialty", `%${activeCase.category}%`).limit(3)
        : Promise.resolve({ data: [] }),
      activeCase?.country
        ? supabase.from("dv_hospitals").select("*").ilike("country", `%${activeCase.country}%`).limit(3)
        : Promise.resolve({ data: [] }),
      activeCase?.category
        ? supabase.from("dv_packages").select("*").ilike("specialty", `%${activeCase.category}%`).limit(3)
        : Promise.resolve({ data: [] }),
    ]);

  const timelines: CaseTimeline[] = (timelineResult.data || []) as CaseTimeline[];
  const appointments: Appointment[] = (appointmentsResult.data || []) as Appointment[];
  const prescriptions: Prescription[] = (prescriptionsResult.data || []) as Prescription[];
  const recommendedDoctors: Doctor[] = (doctorsResult.data || []) as Doctor[];
  const recommendedHospitals: Hospital[] = (hospitalsResult.data || []) as Hospital[];
  const recommendedPackages: Package[] = (packagesResult.data || []) as Package[];

  return (
    <div className="space-y-8">
      <SectionHeader title="Care Plan" subtitle="Your diagnosis, treatment options and journey timeline" />

      {!activeCase ? (
        <EmptyState
          title="No care plan yet"
          subtitle="Submit a case so our team can prepare a personalized treatment plan."
        />
      ) : (
        <>
          <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="font-heading text-xl font-semibold text-navy">{activeCase.category}</h2>
                <p className="mt-1 text-sm text-muted">{activeCase.condition}</p>
              </div>
              <Badge tone="info">{activeCase.status}</Badge>
            </div>
            <div className="mt-6 grid gap-4 border-t border-border pt-6 sm:grid-cols-3">
              <div>
                <p className="text-xs font-medium uppercase text-muted">Previous treatment</p>
                <p className="mt-1 text-sm text-dark">{activeCase.previous_treatment || "—"}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase text-muted">Location</p>
                <p className="mt-1 text-sm text-dark">{activeCase.city || activeCase.country || "—"}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase text-muted">Submitted</p>
                <p className="mt-1 text-sm text-dark">{formatDate(activeCase.created_at)}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-xl border border-border bg-white p-6 shadow-sm lg:col-span-2">
              <h2 className="font-heading text-lg font-semibold text-navy">Journey timeline</h2>
              {timelines.length === 0 ? (
                <p className="mt-4 text-sm text-muted">Your case is under medical review. Updates will appear here.</p>
              ) : (
                <ol className="mt-4 space-y-6 border-l border-border pl-4">
                  {timelines.map((t) => (
                    <li key={t.id} className="relative pl-6">
                      <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-teal" />
                      <p className="text-sm font-medium text-dark">{t.stage}</p>
                      <p className="text-sm text-muted">{t.note}</p>
                      <p className="mt-1 text-xs text-muted">{formatDate(t.created_at)}</p>
                    </li>
                  ))}
                </ol>
              )}
            </div>

            <div className="space-y-6">
              <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
                <h2 className="font-heading text-lg font-semibold text-navy">Appointments</h2>
                {appointments.length === 0 ? (
                  <p className="mt-4 text-sm text-muted">No appointments scheduled.</p>
                ) : (
                  <ul className="mt-4 space-y-3">
                    {appointments.slice(0, 4).map((a) => (
                      <li key={a.id} className="text-sm">
                        <p className="font-medium text-dark">{a.type}</p>
                        <p className="text-muted">{a.dv_doctors?.name} · {formatDate(a.scheduled_at || "")}</p>
                      </li>
                    ))}
                  </ul>
                )}
                <Link href="/doctors" className="mt-4 inline-block text-sm font-medium text-teal hover:text-navy">
                  Book consultation →
                </Link>
              </div>

              <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
                <h2 className="font-heading text-lg font-semibold text-navy">Prescriptions</h2>
                {prescriptions.length === 0 ? (
                  <p className="mt-4 text-sm text-muted">No prescriptions issued yet.</p>
                ) : (
                  <ul className="mt-4 space-y-2">
                    {prescriptions.slice(0, 3).map((rx) => (
                      <li key={rx.id} className="text-sm text-dark">
                        {rx.medications?.[0]?.name || "Prescription"} · <span className="text-muted">{rx.status}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <Link href="/patient/prescriptions" className="mt-4 inline-block text-sm font-medium text-teal hover:text-navy">
                  View all →
                </Link>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {recommendedDoctors.length > 0 && (
              <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
                <h2 className="font-heading text-lg font-semibold text-navy">Recommended doctors</h2>
                <ul className="mt-4 space-y-3">
                  {recommendedDoctors.map((d) => (
                    <li key={d.id} className="text-sm">
                      <Link href={`/doctors/${d.slug}`} className="font-medium text-dark hover:text-teal">
                        {d.name}
                      </Link>
                      <p className="text-muted">{d.specialty}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {recommendedHospitals.length > 0 && (
              <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
                <h2 className="font-heading text-lg font-semibold text-navy">Recommended hospitals</h2>
                <ul className="mt-4 space-y-3">
                  {recommendedHospitals.map((h) => (
                    <li key={h.id} className="text-sm">
                      <Link href={`/hospitals/${h.slug}`} className="font-medium text-dark hover:text-teal">
                        {h.name}
                      </Link>
                      <p className="text-muted">{h.city}, {h.country}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {recommendedPackages.length > 0 && (
              <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
                <h2 className="font-heading text-lg font-semibold text-navy">Recommended packages</h2>
                <ul className="mt-4 space-y-3">
                  {recommendedPackages.map((p) => (
                    <li key={p.id} className="text-sm">
                      <Link href={`/packages/${p.slug}`} className="font-medium text-dark hover:text-teal">
                        {p.name}
                      </Link>
                      <p className="text-muted">{p.price}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
