import Link from "next/link";

const teleconsultations = [
  { patient: "Sarah Thompson", time: "09:00 AM", date: "Tomorrow", type: "Video" },
  { patient: "John Carter", time: "02:00 PM", date: "Tomorrow", type: "Video" },
  { patient: "Mei Lin", time: "11:45 AM", date: "Today", type: "Follow-up", completed: true },
];

export default function DoctorTeleconsultationsPage() {
  return (
    <section className="bg-warm-white py-10 lg:py-16">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-3xl font-semibold text-navy md:text-4xl">Teleconsultations</h1>
            <p className="mt-2 text-muted">Upcoming and completed video calls.</p>
          </div>
          <Link href="/doctor/dashboard" className="text-sm font-medium text-teal hover:text-navy">
            Back to dashboard
          </Link>
        </div>

        <div className="space-y-4">
          {teleconsultations.map((t) => (
            <div key={t.patient + t.time} className="flex items-center justify-between rounded-lg border border-border bg-white p-5 shadow-sm">
              <div>
                <p className="font-medium text-dark">{t.patient}</p>
                <p className="text-sm text-muted">{t.date} · {t.time} · {t.type}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${t.completed ? "bg-sage text-dark" : "bg-champagne/40 text-navy"}`}>
                {t.completed ? "Completed" : "Upcoming"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
