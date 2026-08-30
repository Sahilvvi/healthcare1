import Image from "next/image";
import { supabasePublic } from "@/app/lib/supabase/public";
import { Reveal } from "@/app/components/Reveal";
import { FinalCTA } from "@/app/components/FinalCTA";
import { StatCard } from "@/app/components/dashboard/StatCard";
import { SectionIntro } from "@/app/components/ui/SectionIntro";
import { Users, Building2, Stethoscope, Globe, Award, ShieldCheck, Clock, HeartHandshake } from "lucide-react";

export const revalidate = 60;

const values = [
  {
    title: "Patient-first",
    description: "Every decision is made around what is best for the patient and their family.",
    icon: HeartHandshake,
  },
  {
    title: "Transparency",
    description: "Clear costs, honest timelines and no hidden fees at any stage of the journey.",
    icon: ShieldCheck,
  },
  {
    title: "Excellence",
    description: "We partner only with verified doctors and accredited hospitals.",
    icon: Award,
  },
  {
    title: "Compassion",
    description: "Care coordinators provide human support before, during and after treatment.",
    icon: Clock,
  },
];

const accreditations = [
  "JCI Accreditation",
  "NABH Certified Partners",
  "NABL Approved Labs",
  "ISO 27001 Data Security",
  "HIPAA-aligned Processes",
  "24/7 Clinical Governance",
];

const milestones = [
  { year: "2018", title: "Founded in Chennai", desc: "Started with a single mission: simplify healthcare for international patients." },
  { year: "2020", title: "First 500 patients", desc: "Reached patients from 12 countries with end-to-end coordination." },
  { year: "2022", title: "Pan-India network", desc: "Onboarded 40+ verified hospitals across Delhi, Mumbai, Chennai and Bangalore." },
  { year: "2024", title: "Digital platform", desc: "Launched the patient portal for case tracking, appointments and teleconsultation." },
];

async function fetchStats() {
  const [
    { count: patientsCount },
    { count: hospitalsCount },
    { count: doctorsCount },
    { data: countriesData },
  ] = await Promise.all([
    supabasePublic.from("dv_cases").select("*", { count: "exact", head: true }),
    supabasePublic.from("dv_hospitals").select("*", { count: "exact", head: true }),
    supabasePublic.from("dv_doctors").select("*", { count: "exact", head: true }),
    supabasePublic.from("dv_profiles").select("country").eq("role", "patient"),
  ]);

  const countries = new Set((countriesData || []).map((c: { country?: string | null }) => c.country).filter(Boolean));

  return [
    { value: patientsCount ?? 1200, suffix: "+", label: "Patients guided", icon: Users },
    { value: hospitalsCount ?? 40, suffix: "+", label: "Verified hospitals", icon: Building2 },
    { value: doctorsCount ?? 60, suffix: "+", label: "Specialist doctors", icon: Stethoscope },
    { value: countries.size || 15, suffix: "+", label: "Countries served", icon: Globe },
  ];
}

export default async function AboutPage() {
  const stats = await fetchStats();

  return (
    <>
      <section className="bg-warm-white bg-dot-pattern py-12 lg:py-20">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <Reveal>
            <div className="mb-16 max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-widest text-teal">About us</p>
              <h1 className="mt-3 font-heading text-3xl font-semibold text-navy md:text-5xl">
                Healthcare in India, simplified for the world
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-muted">
                Dadashri Vishwa Healthcare was built around one idea: international patients deserve the same clarity, confidence and compassion as local patients.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-sage shadow-sm">
                <Image
                  src="https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&q=80&w=1200"
                  alt="Medical team consultation"
                  width={1200}
                  height={900}
                  className="h-full w-full object-cover"
                />
              </div>
            </Reveal>
            <Reveal delay={100}>
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
            </Reveal>
          </div>

          <Reveal delay={150}>
            <div className="mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <StatCard key={stat.label} label={stat.label} value={`${stat.value}${stat.suffix}`} icon={stat.icon} />
              ))}
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className="mt-24">
              <SectionIntro
                eyebrow="Our values"
                title="The principles behind every care journey"
                subtitle="These values guide every decision our medical and operations teams make."
                align="center"
              />
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {values.map((v) => (
                  <div
                    key={v.title}
                    className="group rounded-2xl border border-border bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sage text-teal transition-transform group-hover:scale-110">
                      <v.icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-5 font-heading text-lg font-semibold text-navy">{v.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{v.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={250}>
            <div className="mt-24 rounded-2xl border border-border bg-white p-8 lg:p-12">
              <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-widest text-teal">How we work</p>
                  <h2 className="mt-3 font-heading text-2xl font-semibold text-navy md:text-3xl">
                    A care coordinator guides every patient
                  </h2>
                  <p className="mt-4 text-muted">
                    From your first enquiry to your return home, a single point of contact coordinates your medical team, travel and follow-up. You are never left navigating a foreign healthcare system alone.
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    { label: "Medical review", desc: "Reports reviewed by specialists within 24 hours" },
                    { label: "Transparent estimates", desc: "Clear inclusions, exclusions and options" },
                    { label: "Concierge travel", desc: "Visa letters, airport pickup and accommodation" },
                    { label: "Ongoing follow-up", desc: "Prescriptions, video calls and messaging" },
                  ].map((item) => (
                    <div key={item.label} className="rounded-xl bg-warm-white p-4 transition-shadow hover:shadow-sm">
                      <p className="font-heading font-semibold text-navy">{item.label}</p>
                      <p className="mt-1 text-sm text-muted">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={300}>
            <div className="mt-24">
              <SectionIntro
                eyebrow="Accreditations"
                title="Trusted standards, verified partners"
                subtitle="We work with hospitals and labs that meet international accreditation standards."
                align="center"
              />
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {accreditations.map((a) => (
                  <div key={a} className="flex items-center gap-3 rounded-xl border border-border bg-white px-5 py-4 shadow-sm">
                    <Award className="h-5 w-5 text-teal" />
                    <span className="text-sm font-medium text-dark">{a}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={350}>
            <div className="mt-24">
              <SectionIntro
                eyebrow="Our journey"
                title="Milestones that built our platform"
                subtitle="From a single-city idea to a full-service international medical-travel concierge."
                align="center"
              />
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-px bg-border lg:left-1/2" />
                <div className="space-y-8">
                  {milestones.map((m, i) => (
                    <div key={m.year} className={`relative flex items-center gap-8 lg:gap-16 ${i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"}`}>
                      <div className="hidden w-1/2 lg:block" />
                      <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full bg-navy text-xs font-semibold text-white ring-4 ring-warm-white">
                        {i + 1}
                      </div>
                      <div className="w-full rounded-xl border border-border bg-white p-5 shadow-sm lg:w-1/2">
                        <span className="text-xs font-semibold uppercase tracking-widest text-teal">{m.year}</span>
                        <h3 className="mt-1 font-heading text-lg font-semibold text-navy">{m.title}</h3>
                        <p className="mt-1 text-sm text-muted">{m.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
