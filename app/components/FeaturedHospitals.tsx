import Image from "next/image";
import Link from "next/link";
import type { Hospital } from "../lib/types";

export function FeaturedHospitals({ hospitals }: { hospitals?: Hospital[] }) {
  const displayHospitals = hospitals?.slice(0, 3) || [];

  return (
    <section className="bg-warm-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-teal">Partner hospitals</p>
            <h2 className="mt-3 font-heading text-3xl font-semibold text-navy md:text-4xl">
              Accredited centres for international patients
            </h2>
          </div>
          <Link href="/hospitals" className="text-base font-medium text-teal hover:text-navy">
            View all hospitals →
          </Link>
        </div>

        {displayHospitals.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {displayHospitals.map((hospital) => (
              <Link
                key={hospital.id}
                href={`/hospitals/${hospital.slug}`}
                className="group overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="aspect-[4/3] overflow-hidden bg-sage">
                  <Image
                    src={hospital.image}
                    alt={hospital.name}
                    width={800}
                    height={600}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-heading text-lg font-semibold text-navy">{hospital.name}</h3>
                  <p className="mt-1 text-sm text-muted">{hospital.city}, {hospital.country}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {hospital.accreditations?.slice(0, 3).map((acc) => (
                      <span key={acc} className="rounded-md border border-border bg-warm-white px-2 py-1 text-xs text-dark">
                        {acc}
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
