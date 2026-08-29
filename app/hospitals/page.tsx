"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { hospitals } from "../lib/hospitals";

const allSpecialties = Array.from(
  new Set(hospitals.flatMap((h) => h.specialties))
).sort();
const allCities = Array.from(new Set(hospitals.map((h) => h.city))).sort();

export default function HospitalsPage() {
  const [specialty, setSpecialty] = useState("All");
  const [city, setCity] = useState("All");

  const filtered = useMemo(() => {
    return hospitals.filter((h) => {
      const matchesSpecialty = specialty === "All" || h.specialties.includes(specialty);
      const matchesCity = city === "All" || h.city === city;
      return matchesSpecialty && matchesCity;
    });
  }, [specialty, city]);

  return (
    <section className="bg-warm-white py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-teal">
            Accredited centres
          </p>
          <h1 className="mt-2 font-heading text-3xl font-semibold text-navy md:text-4xl">
            Trusted hospitals for international care
          </h1>
          <p className="mt-3 text-muted">
            Verified hospitals with JCI/NABH accreditation, dedicated
            international patient desks and English-speaking care teams.
          </p>
        </div>

        <div className="mb-10 flex flex-col gap-4 sm:flex-row">
          <select
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            className="rounded-md border border-border bg-white px-4 py-2.5 text-sm text-dark outline-none focus:border-teal"
          >
            <option value="All">All specialties</option>
            {allSpecialties.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="rounded-md border border-border bg-white px-4 py-2.5 text-sm text-dark outline-none focus:border-teal"
          >
            <option value="All">All cities</option>
            {allCities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <p className="mb-6 text-sm text-muted">{filtered.length} hospital{filtered.length !== 1 && "s"}</p>

        <div className="grid gap-6 lg:grid-cols-2">
          {filtered.map((hospital) => (
            <Link
              key={hospital.slug}
              href={`/hospitals/${hospital.slug}`}
              className="group overflow-hidden rounded-lg border border-border bg-white shadow-sm transition-all hover:shadow-md"
            >
              <div className="aspect-[21/9] overflow-hidden bg-sage">
                <Image
                  src={hospital.image}
                  alt={hospital.name}
                  width={1200}
                  height={514}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-heading text-xl font-semibold text-navy">
                      {hospital.name}
                    </h2>
                    <p className="text-sm text-muted">
                      {hospital.city}, {hospital.country}
                    </p>
                  </div>
                  <span className="rounded-full bg-champagne/40 px-3 py-1 text-xs font-medium text-navy">
                    {hospital.beds} beds
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {hospital.accreditations.map((acc) => (
                    <span
                      key={acc}
                      className="rounded-md border border-border bg-warm-white px-2.5 py-1 text-xs text-dark"
                    >
                      {acc}
                    </span>
                  ))}
                </div>
                <p className="mt-4 line-clamp-2 text-sm text-muted">
                  {hospital.about}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
