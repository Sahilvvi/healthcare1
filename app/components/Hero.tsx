import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-warm-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-28">
        <div className="animate-fade-up">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-teal">
            Global Healthcare in India
          </p>
          <h1 className="font-heading text-4xl font-semibold leading-tight text-navy md:text-5xl lg:text-6xl">
            World-Class Care.
            <br />
            One Journey.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            From medical evaluation to treatment, travel assistance and
            recovery — experience a simpler way to access trusted healthcare in
            India.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="#packages"
              className="rounded-md bg-navy px-6 py-3.5 text-base font-medium text-white shadow-sm transition-colors hover:bg-teal"
            >
              Get Your Treatment Plan
            </Link>
            <Link
              href="#treatments"
              className="rounded-md border border-border bg-white px-6 py-3.5 text-base font-medium text-dark transition-colors hover:border-navy hover:text-navy"
            >
              Explore Treatments
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-muted">
            <div className="flex items-center gap-2">
              <CheckIcon />
              <span>Verified Doctors</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckIcon />
              <span>Trusted Hospitals</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckIcon />
              <span>International Patient Support</span>
            </div>
          </div>
        </div>
        <div className="relative animate-fade-up [animation-delay:120ms]">
          <div className="aspect-[4/3] overflow-hidden rounded-lg bg-sage">
            <Image
              src="https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&q=80&w=1600"
              alt="Doctor consulting with patient"
              width={1600}
              height={1200}
              className="h-full w-full object-cover"
              priority
            />
          </div>
          <div className="absolute -bottom-6 -left-6 hidden rounded-lg bg-navy p-6 text-white shadow-lg lg:block">
            <p className="font-heading text-2xl font-semibold">1,200+</p>
            <p className="text-sm text-white/80">Patients guided this year</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-teal"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
