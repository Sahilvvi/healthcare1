import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import { supabaseAdmin } from "@/app/lib/supabase/admin";
import type { Case, Profile, Appointment, MedicineOrder, CaseTimeline, Document } from "@/app/lib/types";
import { CaseNoteForm, PrescriptionForm, FollowUpForm } from "../CaseActions";

interface CaseNote {
  id: string;
  case_id: string;
  doctor_id: string;
  note: string;
  created_at: string;
  dv_profiles?: { name: string } | null;
}

function formatItems(items: unknown): string {
  if (Array.isArray(items)) return items.map(String).join(", ");
  if (typeof items === "string") return items;
  return "—";
}

export default async function DoctorCasePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: caseId } = await params;

  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const { data: profile } = await supabase.from("dv_profiles").select("role").eq("id", user.id).single();
  const role = (profile as { role?: string } | null)?.role;
  if (role !== "doctor" && role !== "admin") {
    redirect("/patient/dashboard");
  }

  const { data: caseData } = await supabaseAdmin
    .from("dv_cases")
    .select("*, dv_profiles!patient_id(*)")
    .eq("id", caseId)
    .single();

  if (!caseData) {
    notFound();
  }

  const caseRecord = caseData as Case & { dv_profiles: Profile | null };

  const [{ data: notes }, { data: prescriptions }, { data: appointments }, { data: timeline }, { data: documents }] =
    await Promise.all([
      supabaseAdmin
        .from("dv_case_notes")
        .select("*, dv_profiles!doctor_id(name)")
        .eq("case_id", caseId)
        .order("created_at", { ascending: false }),
      supabaseAdmin.from("dv_medicine_orders").select("*").eq("case_id", caseId).order("created_at", { ascending: false }),
      supabaseAdmin.from("dv_appointments").select("*").eq("case_id", caseId).order("scheduled_at", { ascending: true }),
      supabaseAdmin.from("dv_case_timeline").select("*").eq("case_id", caseId).order("created_at", { ascending: false }),
      supabaseAdmin.from("dv_documents").select("*").eq("case_id", caseId).order("created_at", { ascending: false }),
    ]);

  return (
    <section className="bg-warm-white py-10 lg:py-16">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-heading text-3xl font-semibold text-navy md:text-4xl">Case details</h1>
            <p className="mt-2 text-muted">{caseRecord.dv_profiles?.name || "Patient"} · {caseRecord.condition || caseRecord.category}</p>
          </div>
          <Link href="/doctor/patients" className="text-sm font-medium text-teal hover:text-navy">
            Back to patients
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <div className="rounded-lg border border-border bg-white p-6 shadow-sm">
              <h2 className="font-heading text-lg font-semibold text-navy">Patient information</h2>
              <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-xs uppercase tracking-wide text-muted">Name</dt>
                  <dd className="text-sm font-medium text-dark">{caseRecord.dv_profiles?.name}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-muted">Country</dt>
                  <dd className="text-sm font-medium text-dark">{caseRecord.dv_profiles?.country || "—"}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-muted">Category</dt>
                  <dd className="text-sm font-medium text-dark">{caseRecord.category || "—"}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-muted">Status</dt>
                  <dd className="text-sm font-medium text-dark">{caseRecord.status}</dd>
                </div>
                {caseRecord.previous_treatment && (
                  <div className="sm:col-span-2">
                    <dt className="text-xs uppercase tracking-wide text-muted">Previous treatment</dt>
                    <dd className="text-sm text-dark">{caseRecord.previous_treatment}</dd>
                  </div>
                )}
              </dl>
            </div>

            <div className="rounded-lg border border-border bg-white p-6 shadow-sm">
              <h2 className="font-heading text-lg font-semibold text-navy">Case notes</h2>
              <div className="mt-4 space-y-4">
                {(notes as CaseNote[] || []).map((n) => (
                  <div key={n.id} className="rounded-md border border-border bg-warm-white p-4">
                    <p className="text-sm text-dark">{n.note}</p>
                    <p className="mt-2 text-xs text-muted">
                      {n.dv_profiles?.name || "Doctor"} · {new Date(n.created_at).toLocaleString()}
                    </p>
                  </div>
                ))}
                {(!notes || notes.length === 0) && <p className="text-sm text-muted">No notes yet.</p>}
              </div>
              <div className="mt-6 border-t border-border pt-6">
                <CaseNoteForm caseId={caseRecord.id} />
              </div>
            </div>

            <div className="rounded-lg border border-border bg-white p-6 shadow-sm">
              <h2 className="font-heading text-lg font-semibold text-navy">Prescriptions</h2>
              <div className="mt-4 space-y-3">
                {(prescriptions as MedicineOrder[] || []).map((p) => (
                  <div key={p.id} className="rounded-md border border-border bg-warm-white p-4">
                    <p className="text-sm text-dark">{formatItems(p.items)}</p>
                    <p className="mt-1 text-xs text-muted">{p.status}</p>
                  </div>
                ))}
                {(!prescriptions || prescriptions.length === 0) && <p className="text-sm text-muted">No prescriptions yet.</p>}
              </div>
              <div className="mt-6 border-t border-border pt-6">
                <PrescriptionForm caseId={caseRecord.id} patientId={caseRecord.patient_id} />
              </div>
            </div>

            <div className="rounded-lg border border-border bg-white p-6 shadow-sm">
              <h2 className="font-heading text-lg font-semibold text-navy">Follow-ups & teleconsultations</h2>
              <div className="mt-4 space-y-3">
                {(appointments as Appointment[] || []).map((a) => (
                  <div key={a.id} className="rounded-md border border-border bg-warm-white p-4">
                    <p className="text-sm font-medium text-dark">{a.type.replace(/_/g, " ")}</p>
                    <p className="text-xs text-muted">
                      {a.scheduled_at ? new Date(a.scheduled_at).toLocaleString() : "—"} · {a.status}
                    </p>
                  </div>
                ))}
                {(!appointments || appointments.length === 0) && <p className="text-sm text-muted">No follow-ups scheduled.</p>}
              </div>
              <div className="mt-6 border-t border-border pt-6">
                <FollowUpForm caseId={caseRecord.id} patientId={caseRecord.patient_id} />
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="rounded-lg border border-border bg-white p-6 shadow-sm">
              <h2 className="font-heading text-lg font-semibold text-navy">Documents</h2>
              <div className="mt-4 space-y-3">
                {(documents as Document[] || []).map((d) => (
                  <a
                    key={d.id}
                    href={d.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-md border border-border bg-warm-white p-3 text-sm font-medium text-teal hover:text-navy"
                  >
                    {d.label}
                  </a>
                ))}
                {(!documents || documents.length === 0) && <p className="text-sm text-muted">No documents uploaded.</p>}
              </div>
            </div>

            <div className="rounded-lg border border-border bg-white p-6 shadow-sm">
              <h2 className="font-heading text-lg font-semibold text-navy">Timeline</h2>
              <div className="relative mt-4 space-y-6 pl-4">
                <div className="absolute bottom-0 left-[18px] top-4 w-px bg-border" />
                {(timeline as CaseTimeline[] || []).map((t) => (
                  <div key={t.id} className="relative">
                    <div className="absolute -left-[10px] top-1.5 h-2.5 w-2.5 rounded-full bg-teal" />
                    <p className="text-sm font-medium text-dark">{t.stage.replace(/_/g, " ")}</p>
                    {t.note && <p className="text-sm text-muted">{t.note}</p>}
                    <p className="text-xs text-muted">{new Date(t.created_at).toLocaleString()}</p>
                  </div>
                ))}
                {(!timeline || timeline.length === 0) && <p className="text-sm text-muted">No timeline entries yet.</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
