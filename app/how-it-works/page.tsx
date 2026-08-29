const steps = [
  {
    number: "01",
    title: "Share your case",
    description:
      "Submit your condition, reports and preferences through a guided, multi-step form. Your information is encrypted and shared only with your assigned medical team.",
  },
  {
    number: "02",
    title: "Get a medical review",
    description:
      "A qualified specialist reviews your case and suggests the right treatment path, estimated cost and expected duration in India.",
  },
  {
    number: "03",
    title: "Meet your care coordinator",
    description:
      "A dedicated coordinator is assigned to you. They help with doctor selection, hospital matching, visa support and travel logistics.",
  },
  {
    number: "04",
    title: "Book consultations & travel",
    description:
      "Confirm video or in-person consultations, book accommodation and receive airport transfers and interpreter support.",
  },
  {
    number: "05",
    title: "Treatment & recovery",
    description:
      "Receive treatment at a verified hospital, with your coordinator attending appointments. Continue follow-ups and prescriptions through your patient dashboard.",
  },
];

export default function HowItWorksPage() {
  return (
    <section className="bg-warm-white py-16 lg:py-24">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-teal">
          How it works
        </p>
        <h1 className="mt-3 font-heading text-3xl font-semibold text-navy md:text-4xl">
          Your journey, from first click to follow-up
        </h1>

        <div className="mt-12 space-y-8">
          {steps.map((step) => (
            <div
              key={step.number}
              className="flex gap-6 rounded-lg border border-border bg-white p-6"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-semibold text-white">
                {step.number}
              </div>
              <div>
                <h2 className="font-heading text-xl font-semibold text-navy">
                  {step.title}
                </h2>
                <p className="mt-2 text-muted">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
