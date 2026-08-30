import { supabasePublic } from "@/app/lib/supabase/public";
import { Reveal } from "@/app/components/Reveal";
import { FinalCTA } from "@/app/components/FinalCTA";
import { StatCard } from "@/app/components/dashboard/StatCard";
import { SectionIntro } from "@/app/components/ui/SectionIntro";
import { ShieldCheck, Lock, FileCheck, Headphones, Star, Eye, Users, Stethoscope, Clock } from "lucide-react";

export const revalidate = 60;

const items = [
  {
    title: "Verified doctors & hospitals",
    description:
      "Every doctor and hospital on our platform is background-checked for credentials, accreditations (JCI, NABH, NABL) and international patient experience.",
    icon: Stethoscope,
  },
  {
    title: "Transparent pricing",
    description:
      "Treatment packages show what is included and what is not. Final estimates are provided only after medical review, with no hidden fees.",
    icon: FileCheck,
  },
  {
    title: "Encrypted records",
    description:
      "Medical reports, prescriptions and payment records are stored securely and shared only with the care team you authorize.",
    icon: Lock,
  },
  {
    title: "Dedicated coordination",
    description:
      "Each patient is assigned a care coordinator fluent in English and familiar with international medical travel requirements.",
    icon: Users,
  },
  {
    title: "24/7 support",
    description:
      "Our operations team is available around the clock for urgent travel, appointment or medication issues.",
    icon: Headphones,
  },
  {
    title: "No fake reviews",
    description:
      "Patient feedback is collected post-treatment and verified against actual consultation records.",
    icon: Star,
  },
];

const securityPractices = [
  { icon: Lock, title: "End-to-end encryption", desc: "All medical documents are encrypted in transit and at rest." },
  { icon: Eye, title: "Role-based access", desc: "Only the doctors and coordinators assigned to your case can view your records." },
  { icon: FileCheck, title: "Audit logging", desc: "Every record access is logged for compliance and patient visibility." },
  { icon: ShieldCheck, title: "Consent controls", desc: "You approve who sees your data before any sharing occurs." },
];

async function fetchStats() {
  const [{ count: casesCount }, { count: doctorsCount }] = await Promise.all([
    supabasePublic.from("dv_cases").select("*", { count: "exact", head: true }),
    supabasePublic.from("dv_doctors").select("*", { count: "exact", head: true }),
  ]);

  return [
    { value: casesCount ?? 1200, suffix: "+", label: "Cases managed", icon: FileCheck },
    { value: doctorsCount ?? 60, suffix: "+", label: "Verified doctors", icon: Stethoscope },
    { value: "24/7", suffix: "", label: "Coordinator support", icon: Clock },
  ];
}

export default async function TrustSafetyPage() {
  const stats = await fetchStats();

  return (
    <>
      <section className="bg-warm-white bg-dot-pattern py-16 lg:py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <Reveal>
            <div className="mb-14 max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-widest text-teal">Trust & safety</p>
              <h1 className="mt-3 font-heading text-3xl font-semibold text-navy md:text-4xl">
                Why patients trust us
              </h1>
              <p className="mt-4 text-lg text-muted">
                Trust is the center of international healthcare. We verify every provider, protect every record and keep every promise in writing.
              </p>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="mb-16 grid gap-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <StatCard key={stat.label} label={stat.label} value={`${stat.value}${stat.suffix}`} icon={stat.icon} />
              ))}
            </div>
          </Reveal>

          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <Reveal>
              <div className="grid gap-6 md:grid-cols-2">
                {items.map((item) => (
                  <div
                    key={item.title}
                    className="group rounded-2xl border border-border bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sage text-teal transition-transform group-hover:scale-110">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <h2 className="mt-5 font-heading text-lg font-semibold text-navy">
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
                  {[
                    "HIPAA-aligned data handling",
                    "Secure document uploads",
                    "No third-party data sales",
                    "You control who sees your case",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="text-teal">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>

          <Reveal delay={150}>
            <div className="mt-24">
              <SectionIntro
                eyebrow="Security practices"
                title="How we protect your medical information"
                subtitle="Security is not an afterthought. It is built into every layer of the platform."
                align="center"
              />
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {securityPractices.map((s) => (
                  <div key={s.title} className="group rounded-2xl border border-border bg-white p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sage text-teal transition-transform group-hover:scale-110">
                      <s.icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-5 font-heading text-lg font-semibold text-navy">{s.title}</h3>
                    <p className="mt-2 text-sm text-muted">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
