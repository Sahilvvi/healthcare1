import Image from "next/image";
import Link from "next/link";
import { MapPin, Award, ArrowRight } from "lucide-react";
import type { Hospital } from "../lib/types";

export function FeaturedHospitals({ hospitals }: { hospitals?: Hospital[] }) {
  const displayHospitals = hospitals?.slice(0, 3) || [];

  return (
    <section className="relative overflow-hidden bg-warm-white py-24 lg:py-32">
      <div className="absolute inset-0 bg-dot-pattern opacity-20" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-teal">Partner hospitals</p>
            <h2 className="mt-3 font-heading text-4xl font-semibold text-navy md:text-5xl">
              Accredited centres for international patients
            </h2>
          </div>
          <Link href="/hospitals" className="group inline-flex items-center gap-1 text-base font-medium text-teal hover:text-navy">
            View all hospitals <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {displayHospitals.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {displayHospitals.map((hospital) => (
              <Link
                key={hospital.id}
                href={`/hospitals/${hospital.slug}`}
                className="group overflow-hidden rounded-2xl border border-border bg-white shadow-sm card-hover"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-sage">
                  <Image
                    src={hospital.image}
                    alt={hospital.name}
                    width={800}
                    height={600}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent" />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <h3 className="font-heading text-lg font-semibold text-navy">{hospital.name}</h3>
                    <span className="flex items-center gap-1 text-xs text-muted">
                      <MapPin className="h-3 w-3" /> {hospital.city}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted">{hospital.city}, {hospital.country}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {hospital.accreditations?.slice(0, 3).map((acc) => (
                      <span key={acc} className="inline-flex items-center gap-1 rounded-md border border-border bg-warm-white px-2 py-1 text-xs text-dark">
                        <Award className="h-3 w-3 text-teal" /> {acc}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-muted">No hospitals available yet.</p>
        )}
      </div>
    </section>
  );
}
