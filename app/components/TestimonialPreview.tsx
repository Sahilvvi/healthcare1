import Image from "next/image";

const testimonials = [
  {
    quote:
      "Dadashri Vishwa Healthcare handled everything — the doctor shortlist, hospital coordination and even my visa letter. I felt supported at every step.",
    name: "Aisha Rahman",
    location: "Dubai, UAE",
    treatment: "Cardiac consultation",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
  },
  {
    quote:
      "The cost estimate was clear, the hospital was excellent, and my coordinator stayed in touch through my whole recovery.",
    name: "David Thompson",
    location: "London, UK",
    treatment: "Knee replacement",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
  },
  {
    quote:
      "I was nervous about traveling for surgery, but the team made the logistics simple. Highly recommend for international patients.",
    name: "Fatima Al-Sayed",
    location: "Riyadh, Saudi Arabia",
    treatment: "Oncology second opinion",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200",
  },
];

export function TestimonialPreview() {
  return (
    <section className="bg-sage/30 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-14 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-teal">
            Patient stories
          </p>
          <h2 className="mt-3 font-heading text-3xl font-semibold text-navy md:text-4xl">
            Trusted by patients across the world
          </h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-lg border border-border bg-white p-8 shadow-sm transition-shadow duration-300 hover:shadow-md"
            >
              <p className="text-lg leading-relaxed text-dark">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-8 flex items-center gap-4">
                <div className="h-12 w-12 overflow-hidden rounded-full bg-sage">
                  <Image
                    src={t.image}
                    alt={t.name}
                    width={48}
                    height={48}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-heading text-sm font-semibold text-navy">{t.name}</p>
                  <p className="text-xs text-muted">{t.location}</p>
                  <p className="text-xs text-teal">{t.treatment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
