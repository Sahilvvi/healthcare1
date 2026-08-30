import { Reveal } from "./Reveal";

function ShieldIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function ReceiptIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 2v20l2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2V2l-2 2-2-2-2 2-2-2-2 2-2-2-2 2-2-2Z" />
      <path d="M16 8H8" />
      <path d="M16 12H8" />
      <path d="M12 16H8" />
    </svg>
  );
}

function CoordinatorIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function TravelIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12h20" />
      <path d="M2 12c0-5.523 4.477-10 10-10s10 4.477 10 10" />
      <path d="M12 2v20" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

const features = [
  { icon: ShieldIcon, title: "Verified doctors & hospitals", description: "Every specialist and facility is background-checked, accredited and reviewed by our medical team." },
  { icon: ReceiptIcon, title: "Transparent package pricing", description: "No hidden fees. Each estimate outlines what's included so you can plan with confidence." },
  { icon: CoordinatorIcon, title: "Dedicated care coordinator", description: "One point of contact for appointments, reports, travel and follow-ups — from start to recovery." },
  { icon: TravelIcon, title: "Visa & travel support", description: "Medical visa letters, airport transfers, accommodation and local logistics handled for you." },
  { icon: LockIcon, title: "Encrypted records & privacy", description: "Your reports and case details are stored securely and only shared with your assigned team." },
  { icon: GlobeIcon, title: "Multilingual team", description: "Coordinators and interpreters in English, Arabic, French, Russian and major Indian languages." },
];

export function WhyChooseUs() {
  return (
    <section className="bg-warm-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal>
          <div className="mb-14 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-teal">
              Why patients choose us
            </p>
            <h2 className="mt-3 font-heading text-3xl font-semibold text-navy md:text-4xl">
              A simpler way to access trusted healthcare in India
            </h2>
            <p className="mt-4 text-muted">
              We combine medical expertise, transparent pricing and full travel coordination into one continuous care journey.
            </p>
          </div>
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <Reveal key={feature.title} delay={i * 80}>
              <div className="rounded-2xl border border-border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sage text-teal">
                  <feature.icon />
                </div>
                <h3 className="mt-5 font-heading text-lg font-semibold text-navy">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {feature.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
