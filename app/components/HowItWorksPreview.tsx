import Image from "next/image";
import { Reveal } from "./Reveal";
import { FileText, UserSearch, ClipboardList, Plane, HeartPulse } from "lucide-react";

const steps = [
  { number: "01", title: "Share your case", description: "Tell us your symptoms, upload reports and share your travel preferences.", icon: FileText },
  { number: "02", title: "Get matched", description: "Our medical team reviews your case and matches you with the right doctor and hospital.", icon: UserSearch },
  { number: "03", title: "Receive a plan", description: "Review your treatment plan, cost estimate, timeline and inclusions in one place.", icon: ClipboardList },
  { number: "04", title: "Travel & treat", description: "We support your visa, accommodation, airport transfers and hospital appointments.", icon: Plane },
  { number: "05", title: "Recover with follow-up", description: "Continue care after you return home with prescriptions, follow-ups and messaging.", icon: HeartPulse },
];

export function HowItWorksPreview() {
  return (
    <section className="relative overflow-hidden bg-warm-white py-24 lg:py-32">
      <div className="absolute inset-0 bg-dot-pattern opacity-20" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-14 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <Reveal>
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-widest text-teal">How it works</p>
              <h2 className="mt-3 font-heading text-4xl font-semibold text-navy md:text-5xl">
                Five steps to world-class care
              </h2>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <p className="max-w-xl text-lg text-muted">
              From your first medical review to recovery, every step is coordinated by a dedicated care team.
            </p>
          </Reveal>
        </div>

        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <Reveal key={step.number} delay={i * 100}>
                  <div className="group flex gap-5 rounded-2xl border border-border bg-white p-5 shadow-sm card-hover">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-navy text-white transition-transform duration-300 group-hover:scale-110">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-heading text-sm font-semibold text-teal">{step.number}</span>
                        <h3 className="font-heading text-lg font-semibold text-navy">{step.title}</h3>
                      </div>
                      <p className="mt-1 max-w-md text-sm leading-relaxed text-muted">{step.description}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
          <Reveal delay={200}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-sage shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1200"
                alt="Medical team planning patient care"
                width={1200}
                height={900}
                className="h-full w-full object-cover transition-transform duration-1000 hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/30 to-transparent" />
              <div className="absolute bottom-6 left-6 max-w-xs rounded-2xl bg-white/95 p-5 shadow-lg backdrop-blur">
                <p className="font-heading text-2xl font-semibold text-navy">24h</p>
                <p className="text-sm text-muted">Average time to first medical review</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
