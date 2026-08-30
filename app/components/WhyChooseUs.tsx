import { Reveal } from "./Reveal";
import { ShieldCheck, Receipt, Users, Plane, Lock, Globe, ArrowRight } from "lucide-react";

const features = [
  { icon: ShieldCheck, title: "Verified doctors & hospitals", description: "Every specialist and facility is background-checked, accredited and reviewed by our medical team." },
  { icon: Receipt, title: "Transparent package pricing", description: "No hidden fees. Each estimate outlines what's included so you can plan with confidence." },
  { icon: Users, title: "Dedicated care coordinator", description: "One point of contact for appointments, reports, travel and follow-ups — from start to recovery." },
  { icon: Plane, title: "Visa & travel support", description: "Medical visa letters, airport transfers, accommodation and local logistics handled for you." },
  { icon: Lock, title: "Encrypted records & privacy", description: "Your reports and case details are stored securely and only shared with your assigned team." },
  { icon: Globe, title: "Multilingual team", description: "Coordinators and interpreters in English, Arabic, French, Russian and major Indian languages." },
];

export function WhyChooseUs() {
  return (
    <section className="relative overflow-hidden bg-warm-white py-24 lg:py-32">
      <div className="absolute inset-0 bg-soft-radial" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal>
          <div className="mb-14 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-teal">Why patients choose us</p>
            <h2 className="mt-3 font-heading text-4xl font-semibold text-navy md:text-5xl">
              A simpler way to access trusted healthcare in India
            </h2>
            <p className="mt-4 text-lg text-muted">
              We combine medical expertise, transparent pricing and full travel coordination into one continuous care journey.
            </p>
          </div>
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <Reveal key={feature.title} delay={i * 80}>
                <div className="group relative h-full overflow-hidden rounded-2xl border border-border bg-white p-8 shadow-sm card-hover">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sage text-teal transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="mt-6 font-heading text-xl font-semibold text-navy">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{feature.description}</p>
                  <div className="mt-6 flex items-center gap-1 text-sm font-medium text-teal opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    Learn more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
