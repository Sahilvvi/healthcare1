const kpis = [
  { label: "International Patients", value: "1,284" },
  { label: "Active Cases", value: "186" },
  { label: "Today's Consultations", value: "42" },
  { label: "Treatment Revenue", value: "₹4.2 Cr" },
  { label: "Medicine Orders", value: "128" },
];

const pipeline = [
  { patient: "Sarah Thompson", stage: "Medical Review", country: "USA", date: "12 Sep" },
  { patient: "Ahmed Al-Rashid", stage: "Consultation", country: "UAE", date: "13 Sep" },
  { patient: "Mei Lin", stage: "Treatment", country: "Singapore", date: "15 Sep" },
  { patient: "John Carter", stage: "Plan", country: "UK", date: "14 Sep" },
  { patient: "Ravi Patel", stage: "Recovery", country: "India", date: "18 Sep" },
];

const stages = ["New", "Medical Review", "Consultation", "Plan", "Treatment", "Recovery"];

export default function AdminDashboard() {
  return (
    <section className="bg-warm-white py-10 lg:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-semibold text-navy">
            Admin dashboard
          </h1>
          <p className="mt-2 text-muted">International patient operations overview</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {kpis.map((kpi) => (
            <div
              key={kpi.label}
              className="rounded-lg border border-border bg-white p-5 shadow-sm"
            >
              <p className="text-sm text-muted">{kpi.label}</p>
              <p className="mt-2 font-heading text-2xl font-semibold text-navy">
                {kpi.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-lg border border-border bg-white p-6 shadow-sm">
          <h2 className="font-heading text-lg font-semibold text-navy">
            Patient pipeline
          </h2>
          <div className="mt-6 flex items-center justify-between overflow-x-auto">
            {stages.map((stage, i) => (
              <div key={stage} className="flex items-center">
                <div className="whitespace-nowrap rounded-md border border-border bg-warm-white px-4 py-2 text-sm font-medium text-dark">
                  {stage}
                </div>
                {i < stages.length - 1 && (
                  <div className="mx-2 h-px w-6 bg-border" />
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border text-muted">
                <tr>
                  <th className="py-3 font-medium">Patient</th>
                  <th className="py-3 font-medium">Stage</th>
                  <th className="py-3 font-medium">Country</th>
                  <th className="py-3 font-medium">Expected date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {pipeline.map((row) => (
                  <tr key={row.patient}>
                    <td className="py-3 text-dark">{row.patient}</td>
                    <td className="py-3">
                      <span className="rounded-full bg-sage px-2.5 py-1 text-xs text-dark">
                        {row.stage}
                      </span>
                    </td>
                    <td className="py-3 text-muted">{row.country}</td>
                    <td className="py-3 text-muted">{row.date}</td>
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
