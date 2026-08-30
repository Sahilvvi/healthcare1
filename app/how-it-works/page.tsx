import { supabasePublic } from "@/app/lib/supabase/public";
import { Reveal } from "@/app/components/Reveal";
import { FinalCTA } from "@/app/components/FinalCTA";

export const revalidate = 60;

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

async function fetchStats() {
  const [{ count: casesCount }, { count: hospitalsCount }, { count: doctorsCount }] = await Promise.all([
    supabasePublic.from("dv_cases").select("*", { count: "exact", head: true }),
    supabasePublic.from("dv_hospitals").select("*", { count: "exact", head: true }),
    supabasePublic.from("dv_doctors").select("*", { count: "exact", head: true }),
  ]);

  return [
    { value: casesCount ? `${casesCount}+` : "1,200+", label: "Cases managed" },
    { value: hospitalsCount ? `${hospitalsCount}+` : "40+", label: "Partner hospitals" },
    { value: doctorsCount ? `${doctorsCount}+` : "60+", label: "Verified doctors" },
  ];
}

export default async function HowItWorksPage() {
  const stats = await fetchStats();

  return (
    <>
      <section className="bg-warm-white py-16 lg:py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="mb-14 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-teal">
              How it works
            </p>
            <h1 className="mt-3 font-heading text-3xl font-semibold text-navy md:text-4xl">
              Your journey, from first click to follow-up
            </h1>
            <p className="mt-4 text-lg text-muted">
              A clear, guided path designed around international patients. No guesswork, no hidden steps — just a care coordinator taking you from evaluation to recovery.
            </p>
          </div>

          <Reveal>
            <div className="mb-16 grid gap-6 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-lg border border-border bg-white p-6 text-center shadow-sm">
                  <p className="font-heading text-3xl font-semibold text-navy">{stat.value}</p>
                  <p className="mt-1 text-sm text-muted">{stat.label}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <Reveal>
              <div className="space-y-6">
                {steps.map((step) => (
                  <div
                    key={step.number}
                    className="flex gap-6 rounded-lg border border-border bg-white p-6 transition-shadow hover:shadow-md"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-semibold text-white">
                      {step.number}
                    </div>
                    <div>
                      <h2 className="font-heading text-xl font-semibold text-navy">{step.title}</h2>
                      <p className="mt-2 text-muted">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="rounded-2xl border border-border bg-white p-6 lg:p-8">
                <h2 className="font-heading text-2xl font-semibold text-navy">
                  What you can expect
                </h2>
                <p className="mt-3 text-muted">
                  Every patient receives a personalized plan, a single coordinator, and access to verified doctors and hospitals.
                </p>
                <ul className="mt-8 space-y-4">
                  {[
                    "Initial medical review within 24 hours",
                    "Fixed, itemised cost estimates",
                    "Dedicated English-speaking coordinator",
                    "Visa invitation letters and travel support",
                    "Airport pickup and accommodation guidance",
                    "Post-treatment follow-ups and prescriptions",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-dark">
                      <span className="mt-0.5 text-teal">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
