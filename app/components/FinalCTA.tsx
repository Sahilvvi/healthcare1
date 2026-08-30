import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-navy py-24 lg:py-32">
      <div className="absolute inset-0 bg-dot-pattern opacity-10" />
      <div className="absolute inset-0 bg-gradient-to-br from-teal/10 via-transparent to-champagne/10" />
      <div className="relative mx-auto max-w-5xl px-6 text-center lg:px-8">
        <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-teal">
          <MessageCircle className="h-4 w-4" /> Free initial review
        </p>
        <h2 className="mt-6 font-heading text-4xl font-semibold text-white md:text-5xl">
          Ready to start your care journey?
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-white/80">
          Share your case today and receive a personalized treatment plan, doctor recommendations and a cost estimate within 24 hours.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/treatment-plan"
            className="btn-primary w-full rounded-full bg-white px-8 py-4 text-center text-base font-medium text-navy shadow-sm transition-colors hover:bg-champagne sm:w-auto"
          >
            Get Your Treatment Plan
          </Link>
          <Link
            href="/doctors"
            className="group w-full rounded-full border border-white/30 px-8 py-4 text-center text-base font-medium text-white transition-all hover:border-white/60 hover:bg-white/5 sm:w-auto"
          >
            Browse Specialists <ArrowRight className="ml-1 inline-block h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <p className="mt-6 text-sm text-white/60">
          Free initial review. No commitment required.
        </p>
      </div>
    </section>
  );
}
