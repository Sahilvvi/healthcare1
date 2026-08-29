const patients = [
  { name: "Sarah Thompson", country: "USA", case: "Knee Replacement", stage: "Medical Review", coordinator: "Asha R." },
  { name: "Ahmed Al-Rashid", country: "UAE", case: "Cardiac Consultation", stage: "Consultation", coordinator: "Vikram S." },
  { name: "Mei Lin", country: "Singapore", case: "Oncology Evaluation", stage: "Treatment", coordinator: "Priya M." },
  { name: "John Carter", country: "UK", case: "Neurology Review", stage: "Plan", coordinator: "Asha R." },
  { name: "Ravi Patel", country: "India", case: "Wellness Checkup", stage: "Recovery", coordinator: "Vikram S." },
];

const stages = ["New", "Medical Review", "Consultation", "Plan", "Treatment", "Recovery"];

export default function AdminPatientsPage() {
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
            {patients.map((patient) => (
              <tr key={patient.name}>
                <td className="px-4 py-3 font-medium text-dark">{patient.name}</td>
                <td className="px-4 py-3 text-muted">{patient.country}</td>
                <td className="px-4 py-3 text-muted">{patient.case}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-sage px-2.5 py-1 text-xs text-dark">
                    {patient.stage}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted">{patient.coordinator}</td>
              </tr>
            ))}
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
