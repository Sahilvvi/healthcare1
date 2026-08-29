import Link from "next/link";

const journeySteps = [
  { label: "Medical Review", status: "completed" },
  { label: "Consultation", status: "completed" },
  { label: "Treatment Plan", status: "current" },
  { label: "Travel", status: "pending" },
  { label: "Treatment", status: "pending" },
  { label: "Recovery", status: "pending" },
];

const documents = ["Medical Reports", "Prescriptions", "Invoices", "Treatment Plan"];

export default function PatientDashboard() {
  return (
    <section className="bg-warm-white py-10 lg:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-semibold text-navy md:text-4xl">
            Good morning, Sarah
          </h1>
          <p className="mt-2 text-muted">
            Your care coordinator is available for any questions.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-lg border border-border bg-white p-6 shadow-sm lg:col-span-2">
            <h2 className="font-heading text-lg font-semibold text-navy">
              Your Care Journey
            </h2>
            <div className="mt-6 flex justify-between">
              {journeySteps.map((step, i) => (
                <div key={step.label} className="flex flex-1 flex-col items-center text-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${
                      step.status === "completed"
                        ? "bg-teal text-white"
                        : step.status === "current"
                        ? "border-2 border-navy bg-white text-navy"
                        : "bg-sage text-muted"
                    }`}
                  >
                    {step.status === "completed" ? "✓" : i + 1}
                  </div>
                  <p className="mt-3 hidden text-xs text-dark md:block">{step.label}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 h-2 overflow-hidden rounded-full bg-sage">
              <div className="h-full w-1/2 bg-navy" />
            </div>
          </div>

          <div className="rounded-lg border border-border bg-white p-6 shadow-sm">
            <h2 className="font-heading text-lg font-semibold text-navy">
              Upcoming
            </h2>
            <div className="mt-4 rounded-md bg-sage/30 p-4">
              <p className="text-sm font-medium text-navy">Video Consultation</p>
              <p className="mt-1 text-sm text-muted">Dr. Rajiv Menon · Orthopedics</p>
              <p className="mt-1 text-sm text-muted">Tomorrow · 4:30 PM IST</p>
            </div>
            <Link
              href="/patient/consultation"
              className="mt-4 inline-block text-sm font-medium text-teal hover:text-navy"
            >
              Join Consultation →
            </Link>
          </div>

          <div className="rounded-lg border border-border bg-white p-6 shadow-sm">
            <h2 className="font-heading text-lg font-semibold text-navy">
              Your Documents
            </h2>
            <ul className="mt-4 space-y-3">
              {documents.map((doc) => (
                <li key={doc} className="flex items-center justify-between text-sm text-dark">
                  <span>{doc}</span>
                  <Link href="/patient/documents" className="text-teal hover:text-navy">
                    View
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-border bg-white p-6 shadow-sm">
            <h2 className="font-heading text-lg font-semibold text-navy">Medicines</h2>
            <p className="mt-2 text-sm text-muted">Order #4829</p>
            <p className="mt-1 text-sm font-medium text-teal">Out for delivery</p>
            <p className="mt-1 text-sm text-muted">Estimated: Today, 6:00 PM</p>
            <Link
              href="/patient/medicines"
              className="mt-4 inline-block text-sm font-medium text-teal hover:text-navy"
            >
              Track order →
            </Link>
          </div>

          <Link
            href="/patient/travel"
            className="rounded-lg border border-border bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <h2 className="font-heading text-lg font-semibold text-navy">
              Travel Details
            </h2>
            <p className="mt-2 text-sm text-muted">Arrival: 12 Sep 2026</p>
            <p className="mt-1 text-sm text-muted">Airport pickup confirmed</p>
            <p className="mt-1 text-sm text-muted">Hotel: Apollo Courtyard</p>
          </Link>

          <div className="rounded-lg border border-border bg-white p-6 shadow-sm">
            <h2 className="font-heading text-lg font-semibold text-navy">
              Messages
            </h2>
            <p className="mt-2 text-sm text-muted">Care Coordinator replied</p>
            <p className="mt-1 text-sm text-dark">
              &ldquo;Your visa invitation letter is ready for download.&rdquo;
            </p>
            <Link href="/patient/messages" className="mt-4 inline-block text-sm font-medium text-teal hover:text-navy">
              Open chat →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
