import Link from "next/link";

const itinerary = [
  { date: "12 Sep 2026", title: "Arrival in Chennai", detail: "Flight AI 128 · 8:30 AM IST · Airport pickup confirmed" },
  { date: "13 Sep 2026", title: "Medical evaluation", detail: "Apollo Hospital · 10:00 AM · Coordinator will escort" },
  { date: "15 Sep 2026", title: "Treatment begins", detail: "Pre-op checks and admission at 7:00 AM" },
  { date: "18 Sep 2026", title: "Discharge planning", detail: "Discharge summary, medicines and follow-up schedule" },
];

export default function PatientTravelPage() {
  return (
    <section className="bg-warm-white py-10 lg:py-16">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <Link href="/patient/dashboard" className="text-sm text-muted hover:text-teal">
          ← Back to dashboard
        </Link>

        <h1 className="mt-6 font-heading text-3xl font-semibold text-navy">
          Your travel & stay
        </h1>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-lg border border-border bg-white p-6 shadow-sm">
            <h2 className="font-heading text-lg font-semibold text-navy">Visa & documents</h2>
            <ul className="mt-4 space-y-3 text-sm text-dark">
              <li className="flex items-center justify-between">
                <span>Medical visa invitation</span>
                <span className="text-teal">Ready</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Hospital appointment letter</span>
                <span className="text-teal">Ready</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Travel insurance</span>
                <span className="text-muted">Pending</span>
              </li>
            </ul>
          </div>

          <div className="rounded-lg border border-border bg-white p-6 shadow-sm">
            <h2 className="font-heading text-lg font-semibold text-navy">Accommodation</h2>
            <div className="mt-4 text-sm">
              <p className="font-medium text-dark">Apollo Courtyard</p>
              <p className="text-muted">12–20 Sep 2026 · 8 nights</p>
              <p className="mt-2 text-muted">24 Greams Road, Chennai</p>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-white p-6 shadow-sm">
            <h2 className="font-heading text-lg font-semibold text-navy">Coordinator</h2>
            <div className="mt-4 text-sm">
              <p className="font-medium text-dark">Asha Raman</p>
              <p className="text-muted">+91 98765 43210</p>
              <p className="text-muted">asha.r@dadashrihealthcare.com</p>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-lg border border-border bg-white p-6 shadow-sm">
          <h2 className="font-heading text-lg font-semibold text-navy">Itinerary</h2>
          <div className="mt-6 space-y-0">
            {itinerary.map((item, i) => (
              <div key={item.title} className="relative flex gap-4 pb-8 last:pb-0">
                <div className="flex flex-col items-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal text-xs font-semibold text-white">
                    {i + 1}
                  </div>
                  {i < itinerary.length - 1 && <div className="mt-2 h-full w-px bg-border" />}
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-teal">{item.date}</p>
                  <h3 className="mt-1 font-heading font-semibold text-navy">{item.title}</h3>
                  <p className="text-sm text-muted">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
