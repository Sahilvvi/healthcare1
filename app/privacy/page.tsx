export default function PrivacyPage() {
  return (
    <section className="bg-warm-white py-16 lg:py-24">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <h1 className="font-heading text-3xl font-semibold text-navy md:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-4 text-sm text-muted">Last updated: 29 August 2026</p>

        <div className="mt-8 space-y-6 text-muted">
          <p>
            Dadashri Vishwa Healthcare is committed to protecting your personal
            and medical information. This policy explains what data we collect,
            how we use it and your rights.
          </p>

          <h2 className="font-heading text-xl font-semibold text-navy">
            Information we collect
          </h2>
          <p>
            We collect information you provide when you create an account,
            submit a treatment inquiry, upload medical reports or contact our
            team. This may include name, email, phone, country, medical history
            and travel preferences.
          </p>

          <h2 className="font-heading text-xl font-semibold text-navy">
            How we use your information
          </h2>
          <p>
            Your information is used to match you with doctors, prepare treatment
            estimates, coordinate travel and communicate with you. We do not
            sell personal data to third parties.
          </p>

          <h2 className="font-heading text-xl font-semibold text-navy">
            Data security
          </h2>
          <p>
            Medical records are encrypted in transit and at rest. Access is
            restricted to your assigned care team and the specialists reviewing
            your case.
          </p>

          <h2 className="font-heading text-xl font-semibold text-navy">
            Your rights
          </h2>
          <p>
            You can request access to, correction or deletion of your personal
            data at any time by contacting our support team.
          </p>
        </div>
      </div>
    </section>
  );
}
