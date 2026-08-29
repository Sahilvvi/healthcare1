import Link from "next/link";

export default function ConsultationPage() {
  return (
    <section className="bg-warm-white py-10 lg:py-16">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-heading text-2xl font-semibold text-navy md:text-3xl">
            Video Consultation
          </h1>
          <Link
            href="/patient/dashboard"
            className="text-sm font-medium text-teal hover:text-navy"
          >
            Back to dashboard
          </Link>
        </div>

        <div className="aspect-video rounded-lg border border-border bg-navy/5 p-8 text-center shadow-sm">
          <p className="font-heading text-xl font-semibold text-navy">
            Dr. Rajiv Menon — Orthopedics
          </p>
          <p className="mt-2 text-muted">Tomorrow · 4:30 PM IST</p>
          <p className="mt-6 text-sm text-muted">
            The consultation room will open 15 minutes before your scheduled time.
          </p>
          <button
            type="button"
            disabled
            className="mt-6 rounded-md bg-navy px-6 py-3 text-sm font-medium text-white opacity-60"
          >
            Join call
          </button>
        </div>

        <div className="mt-6 rounded-lg border border-border bg-white p-6 shadow-sm">
          <h2 className="font-heading text-lg font-semibold text-navy">Before the call</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted">
            <li>Keep your reports and ID nearby.</li>
            <li>Test your camera and microphone.</li>
            <li>Join from a quiet, well-lit space.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
