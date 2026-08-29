import Link from "next/link";

const followUps = [
  { patient: "Ravi Patel", due: "30 Aug 2026", reason: "Knee replacement recovery check" },
  { patient: "Fatima Hassan", due: "02 Sep 2026", reason: "Cardiac second opinion outcome" },
  { patient: "Mei Lin", due: "05 Sep 2026", reason: "Post-chemo blood count review" },
];

export default function DoctorFollowUpsPage() {
  return (
    <section className="bg-warm-white py-10 lg:py-16">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-3xl font-semibold text-navy md:text-4xl">Follow-ups</h1>
            <p className="mt-2 text-muted">Scheduled patient follow-ups and reminders.</p>
          </div>
          <Link href="/doctor/dashboard" className="text-sm font-medium text-teal hover:text-navy">
            Back to dashboard
          </Link>
        </div>

        <div className="space-y-4">
          {followUps.map((f) => (
            <div key={f.patient} className="rounded-lg border border-border bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="font-medium text-dark">{f.patient}</p>
                <span className="text-xs text-muted">Due {f.due}</span>
              </div>
              <p className="mt-1 text-sm text-muted">{f.reason}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
