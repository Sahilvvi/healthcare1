import { supabasePublic } from "@/app/lib/supabase/public";
import { Reveal } from "@/app/components/Reveal";
import { FinalCTA } from "@/app/components/FinalCTA";
import { StatCard } from "@/app/components/dashboard/StatCard";
import { Quote, Globe, HeartPulse, Star } from "lucide-react";

export const revalidate = 60;

const stories = [
  {
    name: "Sarah Thompson",
    country: "USA",
    condition: "Knee Replacement",
    hospital: "Apollo Hospitals, Chennai",
    quote:
      "From the first video call to the day I walked out of the hospital, I knew exactly what was happening. My coordinator handled the visa, pickup and every appointment.",
    outcome: "Surgery completed · 12-day stay · Back to walking 2 km daily",
  },
  {
    name: "Ahmed Al-Rashid",
    country: "UAE",
    condition: "Cardiac Consultation",
    hospital: "Fortis Escorts, New Delhi",
    quote:
      "I was anxious about traveling for a heart procedure. The team gave me a clear second opinion, a fixed package price and a single point of contact who spoke Arabic.",
    outcome: "Second opinion + intervention · 8-day stay · Discharged with a recovery plan",
  },
  {
    name: "Mei Lin",
    country: "Singapore",
    condition: "Oncology Evaluation",
    hospital: "Tata Memorial Hospital, Mumbai",
    quote:
      "Speed mattered. Within 48 hours of submitting my reports, I had a treatment plan, cost estimate and a confirmed appointment with the oncology team.",
    outcome: "Evaluation + treatment plan · Ongoing follow-ups via teleconsultation",
  },
];

async function fetchStats() {
  const [{ count: casesCount }, { data: countriesData }] = await Promise.all([
    supabasePublic.from("dv_cases").select("*", { count: "exact", head: true }),
    supabasePublic.from("dv_profiles").select("country").eq("role", "patient"),
  ]);

  const countries = new Set((countriesData || []).map((c: { country?: string | null }) => c.country).filter(Boolean));

  return [
    { value: casesCount ?? 1200, suffix: "+", label: "Patient journeys", icon: HeartPulse },
    { value: countries.size || 15, suffix: "+", label: "Countries served", icon: Globe },
    { value: "4.9", suffix: "/5", label: "Average patient rating", icon: Star },
  ];
}

export default async function StoriesPage() {
  const stats = await fetchStats();

  return (
    <>
      <section className="bg-warm-white bg-dot-pattern py-16 lg:py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <Reveal>
            <div className="mb-14 max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-widest text-teal">Patient stories</p>
              <h1 className="mt-3 font-heading text-3xl font-semibold text-navy md:text-4xl">
                Real journeys, real care
              </h1>
              <p className="mt-4 text-lg text-muted">
                International patients share how a care coordinator, transparent pricing and trusted specialists made their treatment in India simpler.
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

          <div className="space-y-8">
            {stories.map((story, i) => (
              <Reveal key={story.name} delay={i * 80}>
                <div className="rounded-2xl border border-border bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md lg:flex lg:gap-8 lg:p-10">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-semibold text-white lg:h-16 lg:w-16">
                    <Quote className="h-6 w-6" />
                  </div>
                  <div className="mt-6 lg:mt-0">
                    <p className="text-sm font-medium text-teal">
                      {story.condition} · {story.hospital}
                    </p>
                    <blockquote className="mt-4 font-heading text-xl font-medium leading-relaxed text-navy lg:text-2xl">
                      &ldquo;{story.quote}&rdquo;
                    </blockquote>
                    <div className="mt-6 flex flex-col gap-2 border-t border-border pt-6 text-sm sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-medium text-dark">{story.name}</p>
                        <p className="text-muted">{story.country}</p>
                      </div>
                      <span className="rounded-full bg-sage px-3 py-1 text-xs font-medium text-dark">
                        {story.outcome}
                      </span>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={150}>
            <div className="mt-20 rounded-2xl border border-border bg-navy p-8 text-white lg:p-12">
              <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
                <div>
                  <h2 className="font-heading text-2xl font-semibold">Add your voice</h2>
                  <p className="mt-3 text-white/80">
                    Every story helps the next patient feel confident. If you have completed treatment with us, we would love to hear about your experience.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
                  <a
                    href="mailto:care@dadashrihealth.com?subject=My patient story"
                    className="rounded-xl bg-teal px-6 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-navy"
                  >
                    Share your story
                  </a>
                  <a
                    href="mailto:care@dadashrihealth.com"
                    className="rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-white/10"
                  >
                    Contact us
                  </a>
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
