import Link from "next/link";

const documents = [
  { name: "MRI Left Knee", type: "Medical Report", date: "22 Aug 2026", status: "Verified" },
  { name: "Blood Work Summary", type: "Medical Report", date: "21 Aug 2026", status: "Verified" },
  { name: "Discharge Summary", type: "Hospital Record", date: "15 Aug 2026", status: "Verified" },
  { name: "Prescription #4829", type: "Prescription", date: "14 Aug 2026", status: "Active" },
  { name: "Invoice INV-2026-0912", type: "Invoice", date: "12 Aug 2026", status: "Paid" },
  { name: "Treatment Plan", type: "Plan", date: "10 Aug 2026", status: "Current" },
];

export default function PatientDocumentsPage() {
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
                  <th className="py-3 font-medium">Type</th>
                  <th className="py-3 font-medium">Date</th>
                  <th className="py-3 font-medium">Status</th>
                  <th className="py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {documents.map((doc) => (
                  <tr key={doc.name}>
                    <td className="py-4 text-dark">{doc.name}</td>
                    <td className="py-4 text-muted">{doc.type}</td>
                    <td className="py-4 text-muted">{doc.date}</td>
                    <td className="py-4">
                      <span className="rounded-full bg-sage px-2.5 py-1 text-xs text-dark">
                        {doc.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <button className="text-sm font-medium text-teal hover:text-navy">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
