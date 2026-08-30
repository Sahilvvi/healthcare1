"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, ShieldCheck, Users, PlayCircle, Star } from "lucide-react";

const trending = ["Cardiology", "Orthopedics", "Oncology", "Transplants"];

export function Hero() {
  const router = useRouter();
  const [specialty, setSpecialty] = useState("");
  const [focused, setFocused] = useState(false);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = specialty.trim();
    router.push(`/doctors${q ? `?specialty=${encodeURIComponent(q)}` : ""}`);
  };

  const pick = (s: string) => {
    setSpecialty(s);
    router.push(`/doctors?specialty=${encodeURIComponent(s)}`);
  };

  return (
    <section className="relative overflow-hidden bg-warm-white bg-soft-radial">
      <div className="absolute inset-0 bg-dot-pattern opacity-30" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-28">
        <div className="animate-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-1.5 text-sm font-medium text-teal shadow-sm">
            <span className="flex h-2 w-2 animate-pulse rounded-full bg-teal" />
            Free initial medical review
          </div>
          <h1 className="mt-6 font-heading text-5xl font-semibold leading-[1.08] text-navy md:text-6xl lg:text-7xl">
            World-Class Care.
            <br />
            <span className="text-gradient">One Journey.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            From medical evaluation to treatment, travel assistance and recovery — experience a simpler way to access trusted healthcare in India.
          </p>

          <form
            onSubmit={onSearch}
            className="mt-8 flex max-w-xl flex-col gap-3 rounded-2xl border border-border bg-white p-2 shadow-sm sm:flex-row"
          >
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                type="text"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setTimeout(() => setFocused(false), 150)}
                placeholder="Search specialties, doctors, hospitals..."
                className="w-full rounded-xl bg-warm-white py-3 pl-10 pr-4 text-sm outline-none transition-all focus:ring-1 focus:ring-teal"
              />
              {focused && (
                <div className="absolute left-0 right-0 top-full z-20 mt-2 rounded-xl border border-border bg-white p-2 shadow-lg">
                  <p className="px-2 py-1 text-xs font-medium text-muted">Popular specialties</p>
                  <div className="flex flex-wrap gap-2 p-2">
                    {trending.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          pick(s);
                        }}
                        className="rounded-full bg-sage/40 px-3 py-1 text-xs font-medium text-navy transition-colors hover:bg-sage"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button
              type="submit"
              className="btn-primary rounded-xl bg-navy px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-teal"
            >
              Find specialists
            </button>
          </form>

          <div className="mt-4 flex flex-wrap gap-2 text-sm text-muted">
            <span>Trending:</span>
            {trending.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => pick(s)}
                className="font-medium text-teal underline-offset-4 hover:underline"
              >
                {s}
              </button>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-muted">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-teal" />
              <span>Verified doctors</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-teal" />
              <span>Accredited hospitals</span>
            </div>
            <div className="flex items-center gap-2">
              <PlayCircle className="h-5 w-5 text-teal" />
              <span>24/7 coordinator support</span>
            </div>
          </div>
        </div>

        <div className="relative animate-fade-up [animation-delay:120ms]">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-sage shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1576091160403-2204935c1fd6?auto=format&fit=crop&q=80&w=1600"
              alt="Doctor consulting with a patient and family in a modern hospital"
              width={1600}
              height={1200}
              className="h-full w-full object-cover transition-transform duration-1000 hover:scale-[1.03]"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/20 to-transparent" />
          </div>

          <div className="absolute -bottom-6 -left-6 hidden animate-float rounded-2xl bg-navy p-5 text-white shadow-2xl lg:block">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="font-heading text-2xl font-semibold">1,200+</p>
                <p className="text-xs text-white/80">Patients guided this year</p>
              </div>
            </div>
          </div>

          <div className="absolute -top-4 -right-4 hidden animate-float rounded-2xl border border-border bg-white p-4 shadow-lg [animation-delay:1.5s] lg:block">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sage text-teal">
                <Star className="h-5 w-5" />
              </div>
              <div>
                <p className="font-heading text-sm font-semibold text-navy">Trusted care</p>
                <p className="text-xs text-muted">Background-checked teams</p>
              </div>
            </div>
          </div>

          <div className="absolute bottom-8 right-8 hidden max-w-[220px] animate-float rounded-2xl border border-border bg-white/95 p-4 shadow-lg backdrop-blur [animation-delay:0.7s] lg:block">
            <div className="flex items-center gap-1 text-teal">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3 w-3 fill-current" />
              ))}
            </div>
            <p className="mt-2 text-xs leading-relaxed text-dark">
              &ldquo;My coordinator handled everything from the doctor shortlist to my visa letter.&rdquo;
            </p>
            <p className="mt-2 text-xs font-semibold text-navy">Aisha R. · Dubai</p>
          </div>
        </div>
      </div>
    </section>
  );
}
