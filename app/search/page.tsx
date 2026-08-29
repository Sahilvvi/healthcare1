"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { doctors } from "../lib/doctors";
import { hospitals } from "../lib/hospitals";

const allPackages = [
  { name: "Knee Replacement", specialty: "Orthopedics", href: "/packages", price: "$4,800" },
  { name: "Cardiac Bypass", specialty: "Cardiology", href: "/packages", price: "$7,200" },
  { name: "Liver Transplant", specialty: "Transplants", href: "/packages", price: "On request" },
  { name: "Spine Surgery", specialty: "Neurology", href: "/packages", price: "$5,500" },
  { name: "IVF & Fertility", specialty: "Women's Health", href: "/packages", price: "$3,200" },
  { name: "Dental Implants", specialty: "Dental", href: "/packages", price: "$1,200" },
];

function getInitialQuery() {
  if (typeof window === "undefined") return "";
  return new URLSearchParams(window.location.search).get("q") ?? "";
}

export default function SearchPage() {
  const [query, setQuery] = useState(getInitialQuery);

  const q = query.trim().toLowerCase();

  const filteredDoctors = useMemo(
    () =>
      q
        ? doctors.filter(
            (d) =>
              d.name.toLowerCase().includes(q) ||
              d.specialty.toLowerCase().includes(q) ||
              d.hospitals.some((h) => h.toLowerCase().includes(q))
          )
        : doctors,
    [q]
  );

  const filteredHospitals = useMemo(
    () =>
      q
        ? hospitals.filter(
            (h) =>
              h.name.toLowerCase().includes(q) ||
              h.city.toLowerCase().includes(q) ||
              h.country.toLowerCase().includes(q) ||
              h.specialties.some((s) => s.toLowerCase().includes(q))
          )
        : hospitals,
    [q]
  );

  const filteredPackages = useMemo(
    () =>
      q
        ? allPackages.filter(
            (p) =>
              p.name.toLowerCase().includes(q) ||
              p.specialty.toLowerCase().includes(q)
          )
        : allPackages,
    [q]
  );

  const total = filteredDoctors.length + filteredHospitals.length + filteredPackages.length;

  return (
    <section className="bg-warm-white py-10 lg:py-16">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <h1 className="font-heading text-3xl font-semibold text-navy md:text-4xl">
          Search
        </h1>
        <p className="mt-2 text-muted">
          Find doctors, hospitals and treatment packages across the platform.
        </p>

        <form action="/search" method="GET" className="mt-8 flex gap-3">
          <input
            name="q"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, specialty, city or condition"
            className="flex-1 rounded-md border border-border bg-white px-4 py-3 text-sm text-dark outline-none focus:border-teal focus:ring-1 focus:ring-teal"
          />
          <button
            type="submit"
            className="rounded-md bg-navy px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-teal"
          >
            Search
          </button>
        </form>

        <p className="mt-4 text-sm text-muted">
          {q ? `${total} results for "${query.trim()}"` : "Showing all results"}
        </p>

        {filteredDoctors.length > 0 && (
          <div className="mt-10">
            <h2 className="font-heading text-xl font-semibold text-navy">Doctors</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {filteredDoctors.map((doctor) => (
                <Link
                  key={doctor.slug}
                  href={`/doctors/${doctor.slug}`}
                  className="rounded-lg border border-border bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                >
                  <p className="font-heading font-semibold text-navy">{doctor.name}</p>
                  <p className="text-sm text-teal">{doctor.specialty}</p>
                  <p className="text-sm text-muted">{doctor.hospitals.join(" · ")} · {doctor.experience}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {filteredHospitals.length > 0 && (
          <div className="mt-10">
            <h2 className="font-heading text-xl font-semibold text-navy">Hospitals</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {filteredHospitals.map((hospital) => (
                <Link
                  key={hospital.slug}
                  href={`/hospitals/${hospital.slug}`}
                  className="rounded-lg border border-border bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                >
                  <p className="font-heading font-semibold text-navy">{hospital.name}</p>
                  <p className="text-sm text-muted">{hospital.city}, {hospital.country}</p>
                  <p className="text-sm text-muted">{hospital.specialties.join(" · ")}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {filteredPackages.length > 0 && (
          <div className="mt-10">
            <h2 className="font-heading text-xl font-semibold text-navy">Treatment packages</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPackages.map((pkg) => (
                <Link
                  key={pkg.name}
                  href={pkg.href}
                  className="rounded-lg border border-border bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                >
                  <p className="font-heading font-semibold text-navy">{pkg.name}</p>
                  <p className="text-sm text-teal">{pkg.specialty}</p>
                  <p className="mt-2 text-sm text-muted">Starting from {pkg.price}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {q && total === 0 && (
          <p className="mt-10 text-muted">No results found. Try a different keyword.</p>
        )}
      </div>
    </section>
  );
}
