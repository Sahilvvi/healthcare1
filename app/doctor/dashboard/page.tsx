import Link from "next/link";

const stats = [
  { label: "Today's consultations", value: "8" },
  { label: "Pending cases", value: "5" },
  { label: "New reports", value: "3" },
  { label: "Follow-ups", value: "12" },
];

const consultations = [
  { patient: "Sarah Thompson", time: "09:00 AM", type: "Video", status: "Upcoming" },
  { patient: "Ahmed Al-Rashid", time: "10:30 AM", type: "In-person", status: "Upcoming" },
  { patient: "Mei Lin", time: "11:45 AM", type: "Video", status: "Completed" },
  { patient: "John Carter", time: "02:00 PM", type: "In-person", status: "Upcoming" },
];

const pendingCases = [
  { patient: "Ravi Patel", issue: "Knee replacement evaluation", reports: "MRI uploaded" },
  { patient: "Fatima Hassan", issue: "Cardiac second opinion", reports: "ECG pending" },
];

export default function DoctorDashboard() {
  return (
    <section className="bg-warm-white py-10 lg:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-3xl font-semibold text-navy">
              Doctor workspace
            </h1>
            <p className="mt-2 text-muted">Welcome back, Dr. Menon</p>
          </div>
          <Link
            href="#"
            className="rounded-md bg-navy px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal"
          >
            + New consultation
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-lg border border-border bg-white p-5 shadow-sm">
              <p className="text-sm text-muted">{s.label}</p>
              <p className="mt-2 font-heading text-3xl font-semibold text-navy">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-border bg-white p-6 shadow-sm">
            <h2 className="font-heading text-lg font-semibold text-navy">
              Today&apos;s consultations
            </h2>
            <div className="mt-4 divide-y divide-border">
              {consultations.map((c) => (
                <div key={c.patient} className="flex items-center justify-between py-4">
                  <div>
                    <p className="font-medium text-dark">{c.patient}</p>
                    <p className="text-sm text-muted">
                      {c.time} · {c.type}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      c.status === "Completed"
                        ? "bg-sage text-dark"
                        : "bg-champagne/40 text-navy"
                    }`}
                  >
                    {c.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-white p-6 shadow-sm">
            <h2 className="font-heading text-lg font-semibold text-navy">Pending cases</h2>
            <div className="mt-4 divide-y divide-border">
              {pendingCases.map((c) => (
                <div key={c.patient} className="py-4">
                  <p className="font-medium text-dark">{c.patient}</p>
                  <p className="text-sm text-muted">{c.issue}</p>
                  <p className="mt-1 text-xs text-teal">{c.reports}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-white p-6 shadow-sm">
            <h2 className="font-heading text-lg font-semibold text-navy">Quick actions</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {["Prescriptions", "Case notes", "Teleconsultations", "Follow-ups"].map(
                (action) => (
                  <Link
                    key={action}
                    href="#"
                    className="rounded-md border border-border p-4 text-sm font-medium text-dark transition-colors hover:border-navy hover:text-navy"
                  >
                    {action}
                  </Link>
                )
              )}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-white p-6 shadow-sm">
            <h2 className="font-heading text-lg font-semibold text-navy">Patient timeline</h2>
            <div className="mt-4 space-y-4">
              {["New → Review", "Review → Consultation", "Consultation → Plan", "Plan → Treatment"].map(
                (stage, i) => (
                  <div key={stage} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-navy text-xs text-white">
                      {i + 1}
                    </div>
                    <p className="text-sm text-dark">{stage}</p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
