import Image from "next/image";

const values = [
  {
    title: "Patient-first",
    description: "Every decision is made around what is best for the patient and their family.",
  },
  {
    title: "Transparency",
    description: "Clear costs, honest timelines and no hidden fees at any stage of the journey.",
  },
  {
    title: "Excellence",
    description: "We partner only with verified doctors and accredited hospitals.",
  },
  {
    title: "Compassion",
    description: "Care coordinators provide human support before, during and after treatment.",
  },
];

export default function AboutPage() {
  return (
    <section className="bg-warm-white py-12 lg:py-20">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mb-16 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-teal">About us</p>
          <h1 className="mt-3 font-heading text-3xl font-semibold text-navy md:text-5xl">
            Healthcare in India, simplified for the world
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            Dadashri Vishwa Healthcare was built around one idea: international patients deserve the same clarity, confidence and compassion as local patients.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-sage">
            <Image
              src="https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&q=80&w=1200"
              alt="Medical team consultation"
              width={1200}
              height={900}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="space-y-6 text-muted">
            <p>
              We combine verified doctor networks, accredited hospitals and a dedicated care team into a single medical-travel journey.
            </p>
            <p>
              From the first medical review to post-treatment follow-ups, our coordinators handle documentation, travel logistics, appointments and prescriptions — so patients and families can focus on recovery.
            </p>
            <p>
              We do not believe in opaque pricing or generic treatment plans. Every case is reviewed by a qualified medical team and every estimate is built around the individual patient.
            </p>
          </div>
        </div>

        <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { value: "1,200+", label: "Patients guided this year" },
            { value: "40+", label: "Verified hospitals" },
            { value: "60+", label: "Specialist doctors" },
            { value: "15+", label: "Countries served" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-lg border border-border bg-white p-6 text-center shadow-sm">
              <p className="font-heading text-3xl font-semibold text-navy">{stat.value}</p>
              <p className="mt-1 text-sm text-muted">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-20">
          <div className="mb-10 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-teal">Our values</p>
            <h2 className="mt-3 font-heading text-2xl font-semibold text-navy md:text-3xl">
              The principles behind every care journey
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="rounded-lg border border-border bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <h3 className="font-heading text-lg font-semibold text-navy">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
