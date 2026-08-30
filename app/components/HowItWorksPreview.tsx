import Image from "next/image";

const steps = [
  {
    number: "01",
    title: "Share your case",
    description: "Tell us your symptoms, upload reports and share your travel preferences.",
  },
  {
    number: "02",
    title: "Get matched",
    description: "Our medical team reviews your case and matches you with the right doctor and hospital.",
  },
  {
    number: "03",
    title: "Receive a plan",
    description: "Review your treatment plan, cost estimate, timeline and inclusions in one place.",
  },
  {
    number: "04",
    title: "Travel & treat",
    description: "We support your visa, accommodation, airport transfers and hospital appointments.",
  },
  {
    number: "05",
    title: "Recover with follow-up",
    description: "Continue care after you return home with prescriptions, follow-ups and messaging.",
  },
];

export function HowItWorksPreview() {
  return (
    <section className="bg-sage/30 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-14 grid gap-10 lg:grid-cols-2 lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-teal">How it works</p>
            <h2 className="mt-3 font-heading text-3xl font-semibold text-navy md:text-4xl">
              Five steps to world-class care
            </h2>
          </div>
          <p className="max-w-xl text-muted">
            From your first medical review to recovery, every step is coordinated by a dedicated care team.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-8">
            {steps.map((step) => (
              <div key={step.number} className="relative flex gap-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-semibold text-white">
                  {step.number}
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-navy">{step.title}</h3>
                  <p className="mt-1 max-w-md text-sm leading-relaxed text-muted">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-sage shadow-lg">
            <Image
              src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1200"
              alt="Medical team planning patient care"
              width={1200}
              height={900}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
