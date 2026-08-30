import { supabasePublic } from "@/app/lib/supabase/public";
import { Reveal } from "@/app/components/Reveal";
import { FinalCTA } from "@/app/components/FinalCTA";

export const revalidate = 60;

const items = [
  {
    title: "Verified doctors & hospitals",
    description:
      "Every doctor and hospital on our platform is background-checked for credentials, accreditations (JCI, NABH, NABL) and international patient experience.",
  },
  {
    title: "Transparent pricing",
    description:
      "Treatment packages show what is included and what is not. Final estimates are provided only after medical review, with no hidden fees.",
  },
  {
    title: "Encrypted records",
    description:
      "Medical reports, prescriptions and payment records are stored securely and shared only with the care team you authorize.",
  },
  {
    title: "Dedicated coordination",
    description:
      "Each patient is assigned a care coordinator fluent in English and familiar with international medical travel requirements.",
  },
  {
    title: "24/7 support",
    description:
      "Our operations team is available around the clock for urgent travel, appointment or medication issues.",
  },
  {
    title: "No fake reviews",
    description:
      "Patient feedback is collected post-treatment and verified against actual consultation records.",
  },
];

async function fetchStats() {
  const [{ count: casesCount }, { count: doctorsCount }] = await Promise.all([
    supabasePublic.from("dv_cases").select("*", { count: "exact", head: true }),
    supabasePublic.from("dv_doctors").select("*", { count: "exact", head: true }),
  ]);

  return [
    { value: casesCount ? `${casesCount}+` : "1,200+", label: "Cases managed" },
    { value: doctorsCount ? `${doctorsCount}+` : "60+", label: "Verified doctors" },
    { value: "24/7", label: "Coordinator support" },
  ];
}

export default async function TrustSafetyPage() {
  const stats = await fetchStats();

  return (
    <>
      <section className="bg-warm-white py-16 lg:py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="mb-14 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-teal">
              Trust & safety
            </p>
            <h1 className="mt-3 font-heading text-3xl font-semibold text-navy md:text-4xl">
              Why patients trust us
            </h1>
            <p className="mt-4 text-lg text-muted">
              Trust is the center of international healthcare. We verify every
              provider, protect every record and keep every promise in writing.
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
              <div className="grid gap-6 md:grid-cols-2">
                {items.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-lg border border-border bg-white p-6 transition-shadow hover:shadow-md"
                  >
                    <h2 className="font-heading text-lg font-semibold text-navy">
                      {item.title}
                    </h2>
                    <p className="mt-2 text-sm text-muted">{item.description}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="rounded-2xl border border-border bg-navy p-6 text-white lg:p-8">
                <h2 className="font-heading text-2xl font-semibold">Your data, protected</h2>
                <p className="mt-3 text-white/80">
                  We use encrypted storage, role-based access and audit logging. Only the medical team assigned to your case can view your records, and only with your consent.
                </p>
                <ul className="mt-6 space-y-3 text-sm text-white/80">
                  <li className="flex items-start gap-3">
                    <span className="text-teal">✓</span>
                    HIPAA-aligned data handling
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-teal">✓</span>
                    Secure document uploads
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-teal">✓</span>
                    No third-party data sales
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-teal">✓</span>
                    You control who sees your case
                  </li>
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
