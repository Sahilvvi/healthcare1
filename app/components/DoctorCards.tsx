import Image from "next/image";
import Link from "next/link";
import { doctors as fallbackDoctors } from "../lib/doctors";
import type { Doctor } from "../lib/types";

export function DoctorCards({ doctors }: { doctors?: Doctor[] }) {
  const displayDoctors = doctors?.length ? doctors.slice(0, 3) : fallbackDoctors.slice(0, 3);
  return (
    <section id="doctors" className="bg-warm-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-teal">Leading specialists</p>
            <h2 className="mt-3 font-heading text-3xl font-semibold text-navy md:text-4xl">
              Trusted doctors for your care
            </h2>
            <p className="mt-4 text-muted">
              Verified doctors with international experience, language support and transparent outcomes.
            </p>
          </div>
          <Link href="/doctors" className="text-base font-medium text-teal hover:text-navy">
            Browse all doctors →
          </Link>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {displayDoctors.map((doctor) => (
            <div
              key={doctor.slug}
              className="group overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="aspect-[4/3] overflow-hidden bg-sage">
                <Image
                  src={doctor.image}
                  alt={doctor.name}
                  width={800}
                  height={600}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-navy">{doctor.name}</h3>
                    <p className="text-sm text-teal">{doctor.specialty}</p>
                  </div>
                  <span className="flex items-center gap-1 rounded-full bg-champagne/50 px-2.5 py-1 text-xs font-semibold text-navy">
                    <StarIcon />
                    {doctor.rating}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted">
                  <span className="rounded-md bg-sage/40 px-2 py-1 text-xs text-navy">{doctor.experience}</span>
                  <span className="rounded-md bg-sage/40 px-2 py-1 text-xs text-navy">{doctor.procedures}</span>
                </div>
                <p className="mt-4 text-sm text-muted">
                  <span className="text-dark">Languages:</span> {doctor.languages.join(" · ")}
                </p>
                <div className="mt-6 flex gap-3">
                  <Link
                    href={`/doctors/${doctor.slug}`}
                    className="flex-1 rounded-lg border border-border px-4 py-2.5 text-center text-sm font-medium text-dark transition-colors hover:border-navy hover:text-navy"
                  >
                    View Profile
                  </Link>
                  <Link
                    href={`/book/${doctor.slug}`}
                    className="flex-1 rounded-lg bg-navy px-4 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-teal"
                  >
                    Book Consultation
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StarIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-navy">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}
