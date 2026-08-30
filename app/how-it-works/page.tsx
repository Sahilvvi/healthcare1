import Image from "next/image";
import { supabasePublic } from "@/app/lib/supabase/public";
import { Reveal } from "@/app/components/Reveal";
import { FinalCTA } from "@/app/components/FinalCTA";
import { StatCard } from "@/app/components/dashboard/StatCard";
import { SectionIntro } from "@/app/components/ui/SectionIntro";
import { ClipboardList, Stethoscope, UserRound, Plane, HeartPulse, FileCheck, Headphones, ShieldCheck, Clock, Calendar } from "lucide-react";

export const revalidate = 60;

const steps = [
  {
    number: "01",
    title: "Share your case",
    description:
      "Submit your condition, reports and preferences through a guided, multi-step form. Your information is encrypted and shared only with your assigned medical team.",
    icon: ClipboardList,
  },
  {
    number: "02",
    title: "Get a medical review",
    description:
      "A qualified specialist reviews your case and suggests the right treatment path, estimated cost and expected duration in India.",
    icon: Stethoscope,
  },
  {
    number: "03",
    title: "Meet your care coordinator",
    description:
      "A dedicated coordinator is assigned to you. They help with doctor selection, hospital matching, visa support and travel logistics.",
    icon: UserRound,
  },
  {
    number: "04",
    title: "Book consultations & travel",
    description:
      "Confirm video or in-person consultations, book accommodation and receive airport transfers and interpreter support.",
    icon: Plane,
  },
  {
    number: "05",
    title: "Treatment & recovery",
    description:
      "Receive treatment at a verified hospital, with your coordinator attending appointments. Continue follow-ups and prescriptions through your patient dashboard.",
    icon: HeartPulse,
  },
];

const afterBooking = [
  { icon: FileCheck, title: "Confirmation pack", desc: "Visa letter, appointment schedule and accommodation details sent within 24 hours." },
  { icon: Plane, title: "Airport pickup", desc: "A coordinator greets you at the airport and takes you to your hospital or hotel." },
  { icon: Calendar, title: "Daily schedule", desc: "Every appointment, test and consultation is mapped out and shared with you." },
  { icon: Headphones, title: "24/7 support", desc: "Call or message your coordinator at any time for urgent help." },
  { icon: ShieldCheck, title: "Transparent billing", desc: "You see itemised estimates and only approve charges before they happen." },
  { icon: Clock, title: "Follow-up care", desc: "Prescriptions, recovery notes and teleconsultations continue after you return home." },
];

async function fetchStats() {
  const [{ count: casesCount }, { count: hospitalsCount }, { count: doctorsCount }] = await Promise.all([
    supabasePublic.from("dv_cases").select("*", { count: "exact", head: true }),
    supabasePublic.from("dv_hospitals").select("*", { count: "exact", head: true }),
    supabasePublic.from("dv_doctors").select("*", { count: "exact", head: true }),
  ]);

  return [
    { value: casesCount ?? 1200, suffix: "+", label: "Cases managed", icon: ClipboardList },
    { value: hospitalsCount ?? 40, suffix: "+", label: "Partner hospitals", icon: ShieldCheck },
    { value: doctorsCount ?? 60, suffix: "+", label: "Verified doctors", icon: Stethoscope },
  ];
}

export default async function HowItWorksPage() {
  const stats = await fetchStats();

  return (
    <>
      <section className="bg-warm-white bg-dot-pattern py-16 lg:py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <Reveal>
            <div className="mb-14 max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-widest text-teal">How it works</p>
              <h1 className="mt-3 font-heading text-3xl font-semibold text-navy md:text-4xl">
                Your journey, from first click to follow-up
              </h1>
              <p className="mt-4 text-lg text-muted">
                A clear, guided path designed around international patients. No guesswork, no hidden steps — just a care coordinator taking you from evaluation to recovery.
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
              <div className="space-y-6">
                {steps.map((step) => (
                  <div
                    key={step.number}
                    className="group flex gap-5 rounded-2xl border border-border bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-semibold text-white transition-colors group-hover:bg-teal">
                      {step.number}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-heading text-xl font-semibold text-navy">{step.title}</h2>
                      </div>
                      <p className="mt-2 text-muted">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="relative h-full min-h-[400px] overflow-hidden rounded-2xl border border-border shadow-sm">
                <Image
                  src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1200"
                  alt="Medical professional reviewing a care plan"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 text-white lg:p-8">
                  <p className="font-heading text-xl font-semibold">A partner at every step</p>
                  <p className="mt-2 max-w-sm text-sm text-white/80">
                    From medical review to airport pickup, your coordinator keeps your case moving.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={150}>
            <div className="mt-24">
              <SectionIntro
                eyebrow="After booking"
                title="What happens once you arrive"
                subtitle="We do not stop at the appointment. Coordination continues until you are safely home and recovered."
                align="center"
              />
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {afterBooking.map((item) => (
                  <div key={item.title} className="group rounded-2xl border border-border bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sage text-teal transition-transform group-hover:scale-110">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-5 font-heading text-lg font-semibold text-navy">{item.title}</h3>
                    <p className="mt-2 text-sm text-muted">{item.desc}</p>
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
