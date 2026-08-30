import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import { SectionHeader } from "@/app/components/dashboard/SectionHeader";
import { EmptyState } from "@/app/components/dashboard/EmptyState";
import { DocumentUploadForm } from "../documents/DocumentUploadForm";
import type { Document, CaseTimeline } from "@/app/lib/types";

function formatDate(ts: string) {
  return new Date(ts).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default async function PatientMedicalRecordsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: cases } = await supabase.from("dv_cases").select("id, category").eq("patient_id", user.id);
  const caseIds = (cases || []).map((c) => c.id);

  const [documentsResult, timelineResult] = await Promise.all([
    supabase.from("dv_documents").select("*").eq("patient_id", user.id).order("created_at", { ascending: false }),
    caseIds.length
      ? supabase.from("dv_case_timeline").select("*").in("case_id", caseIds).order("created_at", { ascending: false })
      : Promise.resolve({ data: [] }),
  ]);

  const documents: Document[] = (documentsResult.data || []) as Document[];
  const timelines: CaseTimeline[] = (timelineResult.data || []) as CaseTimeline[];

  return (
    <div className="space-y-8">
      <SectionHeader title="Medical Records" subtitle="Reports, prescriptions and case history in one place" />

      <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
        <h2 className="font-heading text-lg font-semibold text-navy">Upload a report</h2>
        <DocumentUploadForm caseIds={caseIds} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
          <h2 className="font-heading text-lg font-semibold text-navy">Documents</h2>
          {documents.length === 0 ? (
            <EmptyState title="No documents" subtitle="Upload reports to share with your medical team." />
          ) : (
            <ul className="mt-4 space-y-3">
              {documents.map((doc) => (
                <li key={doc.id} className="flex items-center justify-between rounded-lg border border-border bg-warm-white px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-dark">{doc.label}</p>
                    <p className="text-xs text-muted">{formatDate(doc.created_at)}</p>
                  </div>
                  <a href={doc.url} target="_blank" rel="noreferrer" className="text-sm font-medium text-teal hover:text-navy">
                    Download
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
          <h2 className="font-heading text-lg font-semibold text-navy">Case history</h2>
          {timelines.length === 0 ? (
            <EmptyState title="No updates" subtitle="Your case timeline will appear here as it progresses." />
          ) : (
            <ol className="mt-4 space-y-4 border-l border-border pl-4">
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
      </div>
    </div>
  );
}
