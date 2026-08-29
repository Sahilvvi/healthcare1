export default function TermsPage() {
  return (
    <section className="bg-warm-white py-16 lg:py-24">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <h1 className="font-heading text-3xl font-semibold text-navy md:text-4xl">
          Terms of Service
        </h1>
        <p className="mt-4 text-sm text-muted">Last updated: 29 August 2026</p>

        <div className="mt-8 space-y-6 text-muted">
          <p>
            By using the Dadashri Vishwa Healthcare platform, you agree to these
            terms. If you do not agree, please do not use the service.
          </p>

          <h2 className="font-heading text-xl font-semibold text-navy">
            Medical disclaimer
          </h2>
          <p>
            Our platform connects you with licensed medical providers. We do
            not provide medical advice ourselves. All treatment decisions are
            made between you and your chosen doctor.
          </p>

          <h2 className="font-heading text-xl font-semibold text-navy">
            Treatment estimates
          </h2>
          <p>
            Package prices and estimates are indicative and may change based on
            the final diagnosis, procedure complexity, hospital choice and other
            clinical factors.
          </p>

          <h2 className="font-heading text-xl font-semibold text-navy">
            Payments and cancellations
          </h2>
          <p>
            Consultation fees may be required to confirm appointments.
            Cancellation and refund policies are shared before each booking is
            confirmed.
          </p>

          <h2 className="font-heading text-xl font-semibold text-navy">
            Use of the platform
          </h2>
          <p>
            You agree to provide accurate information and not misuse the
            platform. We reserve the right to suspend accounts that violate these
            terms.
          </p>
        </div>
      </div>
    </section>
  );
}
