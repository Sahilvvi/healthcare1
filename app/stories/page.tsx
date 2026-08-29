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

export default function StoriesPage() {
  return (
    <section className="bg-warm-white py-16 lg:py-24">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-teal">
          Patient stories
        </p>
        <h1 className="mt-3 font-heading text-3xl font-semibold text-navy md:text-4xl">
          Real journeys, real care
        </h1>
        <p className="mt-3 max-w-2xl text-muted">
          International patients share how a care coordinator, transparent pricing and trusted specialists made their treatment in India simpler.
        </p>

        <div className="mt-12 space-y-8">
          {stories.map((story, i) => (
            <div
              key={story.name}
              className="rounded-lg border border-border bg-white p-6 shadow-sm lg:flex lg:gap-8 lg:p-10"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-semibold text-white lg:h-14 lg:w-14">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="mt-4 lg:mt-0">
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
          ))}
        </div>
      </div>
    </section>
  );
}
