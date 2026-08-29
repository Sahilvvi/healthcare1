import Link from "next/link";

const prescriptions = [
  { patient: "Sarah Thompson", medicine: "Paracetamol 500mg", dosage: "3 times daily", days: "5 days" },
  { patient: "Ravi Patel", medicine: "Ibuprofen 400mg", dosage: "2 times daily after meals", days: "7 days" },
  { patient: "Fatima Hassan", medicine: "Atorvastatin 10mg", dosage: "Once at night", days: "30 days" },
];

export default function DoctorPrescriptionsPage() {
  return (
    <section className="bg-warm-white py-10 lg:py-16">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-3xl font-semibold text-navy md:text-4xl">
              Prescriptions
            </h1>
            <p className="mt-2 text-muted">Manage and review patient prescriptions.</p>
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
                  <th className="py-3 font-medium">Medicine</th>
                  <th className="py-3 font-medium">Dosage</th>
                  <th className="py-3 font-medium">Duration</th>
                  <th className="py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {prescriptions.map((p) => (
                  <tr key={p.patient + p.medicine}>
                    <td className="py-4 text-dark">{p.patient}</td>
                    <td className="py-4 text-muted">{p.medicine}</td>
                    <td className="py-4 text-muted">{p.dosage}</td>
                    <td className="py-4 text-muted">{p.days}</td>
                    <td className="py-4 text-right">
                      <button className="text-sm font-medium text-teal hover:text-navy">Edit</button>
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
