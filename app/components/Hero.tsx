"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const specialties = [
  "All specialties",
  "Cardiology",
  "Orthopedics",
  "Oncology",
  "Neurology",
  "Transplants",
  "Women's Health",
  "Dental",
  "Wellness",
];

export function Hero() {
  const router = useRouter();
  const [specialty, setSpecialty] = useState("All specialties");

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = specialty === "All specialties" ? "" : specialty;
    router.push(`/doctors${q ? `?specialty=${encodeURIComponent(q)}` : ""}`);
  };

  return (
    <section className="relative overflow-hidden bg-warm-white">
      <div className="absolute inset-y-0 right-0 hidden w-1/3 bg-sage/30 lg:block" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-28">
        <div className="animate-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-1.5 text-sm font-medium text-teal shadow-sm">
            <span className="flex h-2 w-2 animate-pulse rounded-full bg-teal" />
            Free initial medical review
          </div>
          <h1 className="mt-6 font-heading text-4xl font-semibold leading-[1.1] text-navy md:text-5xl lg:text-6xl">
            World-Class Care.
            <br />
            <span className="text-teal">One Journey.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            From medical evaluation to treatment, travel assistance and recovery
            — experience a simpler way to access trusted healthcare in India.
          </p>

          <form
            onSubmit={onSearch}
            className="mt-8 flex max-w-xl flex-col gap-3 rounded-xl border border-border bg-white p-2 shadow-sm sm:flex-row"
          >
            <select
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="flex-1 rounded-lg bg-warm-white px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-teal"
            >
              {specialties.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="rounded-lg bg-navy px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-teal"
            >
              Find specialists
            </button>
          </form>

          <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-muted">
            <div className="flex items-center gap-2">
              <CheckIcon />
              <span>Verified doctors</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckIcon />
              <span>Accredited hospitals</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckIcon />
              <span>24/7 coordinator support</span>
            </div>
          </div>
        </div>

        <div className="relative animate-fade-up [animation-delay:120ms]">
          <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-sage shadow-xl">
            <Image
              src="https://images.unsplash.com/photo-1758691462126-2ee47c8bf9e7?auto=format&fit=crop&q=80&w=1600"
              alt="Senior doctor consulting with a mother and child in a modern hospital"
              width={1600}
              height={1200}
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.02]"
              priority
            />
          </div>
          <div className="absolute -bottom-6 -left-6 hidden animate-float rounded-2xl bg-navy p-6 text-white shadow-2xl lg:block">
            <p className="font-heading text-3xl font-semibold">1,200+</p>
            <p className="text-sm text-white/80">Patients guided this year</p>
          </div>
          <div className="absolute -top-4 -right-4 hidden rounded-2xl border border-border bg-white p-4 shadow-lg lg:block">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sage text-teal">
                <ShieldIcon />
              </div>
              <div>
                <p className="font-heading text-sm font-semibold text-navy">Verified care</p>
                <p className="text-xs text-muted">Background-checked teams</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CheckIcon() {
  return (
    <svg
      width="18"
      height="18"
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

function ShieldIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
