import Link from "next/link";

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-navy py-20 lg:py-28">
      <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-teal/10" />
      <div className="absolute -bottom-28 -right-28 h-80 w-80 rounded-full bg-champagne/10" />
      <div className="relative mx-auto max-w-4xl px-6 text-center lg:px-8">
        <h2 className="font-heading text-3xl font-semibold text-white md:text-4xl">
          Ready to start your care journey?
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-white/80">
          Share your case today and receive a personalized treatment plan, doctor recommendations and a cost estimate within 24 hours.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/treatment-plan"
            className="w-full rounded-xl bg-white px-8 py-3.5 text-center text-base font-medium text-navy shadow-sm transition-colors hover:bg-champagne sm:w-auto"
          >
            Get Your Treatment Plan
          </Link>
          <Link
            href="/doctors"
            className="w-full rounded-xl border border-white/30 px-8 py-3.5 text-center text-base font-medium text-white transition-colors hover:border-white/60 sm:w-auto"
          >
            Browse Specialists
          </Link>
        </div>
        <p className="mt-6 text-sm text-white/60">
          Free initial review. No commitment required.
        </p>
      </div>
    </section>
  );
}
