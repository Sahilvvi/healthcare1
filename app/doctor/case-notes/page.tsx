import Link from "next/link";

const notes = [
  { patient: "Sarah Thompson", date: "28 Aug 2026", note: "Knee replacement candidate. Awaiting latest MRI and fitness clearance." },
  { patient: "Ahmed Al-Rashid", date: "27 Aug 2026", note: "Cardiac second opinion requested. Advised coronary angiography before treatment plan." },
  { patient: "Mei Lin", date: "26 Aug 2026", note: "Post-chemo follow-up scheduled. Blood counts stable." },
];

export default function DoctorCaseNotesPage() {
  return (
    <section className="bg-warm-white py-10 lg:py-16">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-3xl font-semibold text-navy md:text-4xl">Case notes</h1>
            <p className="mt-2 text-muted">Review and update patient case notes.</p>
          </div>
          <Link href="/doctor/dashboard" className="text-sm font-medium text-teal hover:text-navy">
            Back to dashboard
          </Link>
        </div>

        <div className="space-y-4">
          {notes.map((n) => (
            <div key={n.patient} className="rounded-lg border border-border bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="font-heading font-semibold text-navy">{n.patient}</p>
                <span className="text-xs text-muted">{n.date}</span>
              </div>
              <p className="mt-2 text-sm text-muted">{n.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
