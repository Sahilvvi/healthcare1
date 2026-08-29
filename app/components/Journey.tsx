const steps = [
  {
    number: "01",
    title: "Medical Evaluation",
    description: "Share your reports and symptoms for a confidential medical review.",
  },
  {
    number: "02",
    title: "Doctor & Hospital Match",
    description: "Get matched with verified specialists and accredited hospitals.",
  },
  {
    number: "03",
    title: "Treatment Plan",
    description: "Review a tailored plan with costs, timeline and inclusions.",
  },
  {
    number: "04",
    title: "Visa & Travel",
    description: "Receive visa, accommodation and airport-transfer support.",
  },
  {
    number: "05",
    title: "Treatment in India",
    description: "Your care coordinator accompanies you through every hospital visit.",
  },
  {
    number: "06",
    title: "Recovery & Follow-up",
    description: "Continue recovery with digital follow-ups and prescriptions.",
  },
];

export function Journey() {
  return (
    <section id="journey" className="bg-sage/40 py-20 lg:py-28">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <div className="mb-14 max-w-2xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-teal">
            Plan → Treat → Recover
          </p>
          <h2 className="font-heading text-3xl font-semibold text-navy md:text-4xl">
            Your healthcare journey, taken care of.
          </h2>
        </div>
        <div className="relative space-y-10 md:space-y-12">
          <div className="absolute left-6 top-0 bottom-0 w-px bg-teal/20 md:left-8" />
          {steps.map((step) => (
            <div key={step.number} className="relative flex items-start gap-6 md:gap-8">
              <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-navy text-white shadow-md md:h-16 md:w-16">
                <span className="font-heading text-sm font-semibold md:text-base">
                  {step.number}
                </span>
              </div>
              <div className="flex-1 rounded-lg border border-border bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md md:p-8">
                <span className="font-heading text-sm font-semibold text-teal">
                  Step {step.number}
                </span>
                <h3 className="mt-1 font-heading text-xl font-semibold text-navy">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-2xl text-muted">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
