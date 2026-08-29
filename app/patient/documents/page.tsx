import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import type { Document } from "@/app/lib/types";

export default async function PatientDocumentsPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const { data: documentsData } = await supabase
    .from("dv_documents")
    .select("*")
    .eq("patient_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  const documents: Document[] = (documentsData as Document[]) || [];

  return (
    <section className="bg-warm-white py-10 lg:py-16">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-3xl font-semibold text-navy md:text-4xl">
              Your documents
            </h1>
            <p className="mt-2 text-muted">
              All your medical reports, prescriptions, invoices and plans in one place.
            </p>
          </div>
          <Link
            href="/patient/dashboard"
            className="text-sm font-medium text-teal hover:text-navy"
          >
            Back to dashboard
          </Link>
        </div>

        <div className="rounded-lg border border-border bg-white p-6 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border text-muted">
                <tr>
                  <th className="py-3 font-medium">Document</th>
                  <th className="py-3 font-medium">Date</th>
                  <th className="py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {documents.map((doc) => (
                  <tr key={doc.id}>
                    <td className="py-4 text-dark">{doc.label}</td>
                    <td className="py-4 text-muted">
                      {new Date(doc.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4 text-right">
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-teal hover:text-navy"
                      >
                        View
                      </a>
                    </td>
                  </tr>
                ))}
                {documents.length === 0 && (
                  <tr>
                    <td className="py-4 text-muted" colSpan={3}>
                      No documents uploaded yet.
                    </td>
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
