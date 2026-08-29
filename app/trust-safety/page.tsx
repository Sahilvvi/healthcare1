const items = [
  {
    title: "Verified doctors & hospitals",
    description:
      "Every doctor and hospital on our platform is background-checked for credentials, accreditations (JCI, NABH, NABL) and international patient experience.",
  },
  {
    title: "Transparent pricing",
    description:
      "Treatment packages show what is included and what is not. Final estimates are provided only after medical review, with no hidden fees.",
  },
  {
    title: "Encrypted records",
    description:
      "Medical reports, prescriptions and payment records are stored securely and shared only with the care team you authorize.",
  },
  {
    title: "Dedicated coordination",
    description:
      "Each patient is assigned a care coordinator fluent in English and familiar with international medical travel requirements.",
  },
  {
    title: "24/7 support",
    description:
      "Our operations team is available around the clock for urgent travel, appointment or medication issues.",
  },
  {
    title: "No fake reviews",
    description:
      "Patient feedback is collected post-treatment and verified against actual consultation records.",
  },
];

export default function TrustSafetyPage() {
  return (
    <section className="bg-warm-white py-16 lg:py-24">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-teal">
          Trust & safety
        </p>
        <h1 className="mt-3 font-heading text-3xl font-semibold text-navy md:text-4xl">
          Why patients trust us
        </h1>
        <p className="mt-4 max-w-2xl text-muted">
          Trust is the center of international healthcare. We verify every
          provider, protect every record and keep every promise in writing.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {items.map((item) => (
            <div
              key={item.title}
              className="rounded-lg border border-border bg-white p-6"
            >
              <h2 className="font-heading text-lg font-semibold text-navy">
                {item.title}
              </h2>
              <p className="mt-2 text-sm text-muted">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
