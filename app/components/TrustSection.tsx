import { Reveal } from "./Reveal";

const badges = [
  { title: "NABH & JCI accredited", description: "Hospitals verified by national and international accreditation bodies." },
  { title: "Encrypted records", description: "Your reports and case details are stored securely and shared only with your team." },
  { title: "Transparent pricing", description: "Every package clearly lists inclusions, exclusions and estimated costs." },
  { title: "24/7 coordinator", description: "Human support across time zones before, during and after treatment." },
];

export function TrustSection() {
  return (
    <section className="bg-navy py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal>
          <div className="mb-12 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-teal">Trust & safety</p>
            <h2 className="mt-3 font-heading text-3xl font-semibold text-white md:text-4xl">
              Why families trust us with their care
            </h2>
          </div>
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {badges.map((badge, i) => (
            <Reveal key={badge.title} delay={i * 80}>
              <div className="h-full rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/10">
                <h3 className="font-heading text-lg font-semibold text-white">{badge.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">{badge.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
