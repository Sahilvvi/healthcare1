import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import { SectionHeader } from "@/app/components/dashboard/SectionHeader";
import { DocumentUploadForm } from "./DocumentUploadForm";
import type { Document } from "@/app/lib/types";

function formatDate(ts: string) {
  return new Date(ts).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default async function PatientDocumentsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: cases } = await supabase.from("dv_cases").select("id").eq("patient_id", user.id);
  const caseIds = (cases || []).map((c) => c.id);

  const { data: documentsData } = await supabase
    .from("dv_documents")
    .select("*")
    .eq("patient_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  const documents: Document[] = (documentsData as Document[]) || [];

  return (
    <div className="space-y-8">
      <SectionHeader title="Documents" subtitle="Reports, prescriptions, invoices and travel documents" />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-white p-6 shadow-sm lg:col-span-1">
          <h2 className="font-heading text-lg font-semibold text-navy">Upload a document</h2>
          <p className="mt-1 text-sm text-muted">Files are encrypted and only shared with your medical team.</p>
          <DocumentUploadForm caseIds={caseIds} />
        </div>

        <div className="rounded-xl border border-border bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="font-heading text-lg font-semibold text-navy">Your files</h2>
          {documents.length === 0 ? (
            <p className="mt-4 text-sm text-muted">No documents uploaded yet.</p>
          ) : (
            <div className="mt-4 overflow-hidden rounded-lg border border-border">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border bg-warm-white text-muted">
                  <tr>
                    <th className="px-4 py-3 font-medium">Document</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {documents.map((doc) => (
                    <tr key={doc.id}>
                      <td className="px-4 py-3 text-dark">{doc.label}</td>
                      <td className="px-4 py-3 text-muted">{formatDate(doc.created_at)}</td>
                      <td className="px-4 py-3 text-right">
                        <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-teal hover:text-navy">
                          View
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
