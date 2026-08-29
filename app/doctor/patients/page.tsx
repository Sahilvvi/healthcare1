import Link from "next/link";

const patients = [
  { name: "Sarah Thompson", country: "USA", case: "Knee replacement evaluation", status: "Active" },
  { name: "Ahmed Al-Rashid", country: "UAE", case: "Cardiac second opinion", status: "Pending reports" },
  { name: "Mei Lin", country: "Singapore", case: "Oncology follow-up", status: "Active" },
  { name: "John Carter", country: "UK", case: "Spine surgery review", status: "New" },
  { name: "Ravi Patel", country: "India", case: "Knee replacement evaluation", status: "Active" },
];

export default function DoctorPatientsPage() {
  return (
    <section className="bg-warm-white py-10 lg:py-16">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-3xl font-semibold text-navy md:text-4xl">Patients</h1>
            <p className="mt-2 text-muted">All patients under your care.</p>
          </div>
          <Link href="/doctor/dashboard" className="text-sm font-medium text-teal hover:text-navy">
            Back to dashboard
          </Link>
        </div>

        <div className="rounded-lg border border-border bg-white p-6 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border text-muted">
                <tr>
                  <th className="py-3 font-medium">Patient</th>
                  <th className="py-3 font-medium">Country</th>
                  <th className="py-3 font-medium">Case</th>
                  <th className="py-3 font-medium">Status</th>
                  <th className="py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {patients.map((p) => (
                  <tr key={p.name}>
                    <td className="py-4 text-dark">{p.name}</td>
                    <td className="py-4 text-muted">{p.country}</td>
                    <td className="py-4 text-muted">{p.case}</td>
                    <td className="py-4">
                      <span className="rounded-full bg-sage px-2.5 py-1 text-xs text-dark">{p.status}</span>
                    </td>
                    <td className="py-4 text-right">
                      <Link href="/doctor/dashboard" className="text-sm font-medium text-teal hover:text-navy">
                        Open case
                      </Link>
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
