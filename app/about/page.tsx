import Image from "next/image";

export default function AboutPage() {
  return (
    <section className="bg-warm-white py-16 lg:py-24">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-teal">
          About us
        </p>
        <h1 className="mt-3 font-heading text-3xl font-semibold text-navy md:text-4xl">
          Healthcare in India, simplified for the world
        </h1>

        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <div className="space-y-6 text-muted">
            <p>
              Dadashri Vishwa Healthcare was built around one idea: international
              patients deserve the same clarity, confidence and compassion as
              local patients. We combine verified doctor networks, accredited
              hospitals and a dedicated care team into a single medical-travel
              journey.
            </p>
            <p>
              From the first medical review to post-treatment follow-ups, our
              coordinators handle documentation, travel logistics, appointments
              and prescriptions — so patients and families can focus on recovery.
            </p>
            <p>
              We do not believe in opaque pricing or generic treatment plans.
              Every case is reviewed by a qualified medical team and every
              estimate is built around the individual patient.
            </p>
          </div>
          <div className="aspect-[4/3] overflow-hidden rounded-lg bg-sage">
            <Image
              src="https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&q=80&w=1200"
              alt="Medical team consultation"
              width={1200}
              height={900}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-white p-6">
            <p className="font-heading text-3xl font-semibold text-navy">1,200+</p>
            <p className="mt-1 text-sm text-muted">Patients guided this year</p>
          </div>
          <div className="rounded-lg border border-border bg-white p-6">
            <p className="font-heading text-3xl font-semibold text-navy">40+</p>
            <p className="mt-1 text-sm text-muted">Verified hospitals</p>
          </div>
          <div className="rounded-lg border border-border bg-white p-6">
            <p className="font-heading text-3xl font-semibold text-navy">60+</p>
            <p className="mt-1 text-sm text-muted">Specialist doctors</p>
          </div>
        </div>
      </div>
    </section>
  );
}
