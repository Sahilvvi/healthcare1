import Image from "next/image";
import Link from "next/link";
import { doctors as fallbackDoctors } from "../lib/doctors";
import type { Doctor } from "../lib/types";
import { Star, Award, ArrowRight } from "lucide-react";

export function DoctorCards({ doctors }: { doctors?: Doctor[] }) {
  const displayDoctors = doctors?.length ? doctors.slice(0, 3) : (fallbackDoctors as unknown as Doctor[]).slice(0, 3);
  return (
    <section id="doctors" className="bg-warm-white py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-teal">Leading specialists</p>
            <h2 className="mt-3 font-heading text-4xl font-semibold text-navy md:text-5xl">
              Trusted doctors for your care
            </h2>
            <p className="mt-4 text-lg text-muted">
              Verified doctors with international experience, language support and transparent outcomes.
            </p>
          </div>
          <Link href="/doctors" className="group inline-flex items-center gap-1 text-base font-medium text-teal hover:text-navy">
            Browse all doctors <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {displayDoctors.map((doctor, i) => (
            <Reveal key={doctor.slug} delay={i * 100}>
              <div className="group overflow-hidden rounded-2xl border border-border bg-white shadow-sm card-hover">
                <div className="relative aspect-[4/3] overflow-hidden bg-sage">
                  <Image
                    src={doctor.image}
                    alt={doctor.name}
                    width={800}
                    height={600}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-heading text-lg font-semibold text-navy">{doctor.name}</h3>
                      <p className="text-sm text-teal">{doctor.specialty}</p>
                    </div>
                    <span className="flex items-center gap-1 rounded-full bg-champagne/50 px-2.5 py-1 text-xs font-semibold text-navy">
                      <Star className="h-3 w-3 fill-current text-navy" />
                      {String(doctor.rating ?? "4.8")}
                    </span>
                  </div>
                  <p className="mt-4 line-clamp-2 text-sm text-muted">
                    {doctor.about}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2 text-sm text-muted">
                    <span className="inline-flex items-center gap-1 rounded-md bg-sage/40 px-2 py-1 text-xs text-navy">
                      <Award className="h-3 w-3" /> {doctor.experience}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-sage/40 px-2 py-1 text-xs text-navy">
                      {doctor.procedures} procedures
                    </span>
                  </div>
                  <p className="mt-4 text-sm text-muted">
                    <span className="text-dark">Languages:</span> {doctor.languages.join(" · ")}
                  </p>
                  <div className="mt-6 flex gap-3">
                    <Link
                      href={`/doctors/${doctor.slug}`}
                      className="flex-1 rounded-xl border border-border px-4 py-2.5 text-center text-sm font-medium text-dark transition-colors hover:border-navy hover:text-navy"
                    >
                      View Profile
                    </Link>
                    <Link
                      href={`/book/${doctor.slug}`}
                      className="flex-1 rounded-xl bg-navy px-4 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-teal"
                    >
                      Book Consultation
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <div
      className={className}
      style={{
        opacity: 0,
        transform: "translateY(20px)",
        animation: `fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms forwards`,
      }}
    >
      {children}
    </div>
  );
}
