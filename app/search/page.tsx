import Link from "next/link";
import { supabasePublic } from "@/app/lib/supabase/public";
import type { Doctor, Hospital, Package } from "@/app/lib/types";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const query = q.trim().toLowerCase();

  const [{ data: doctorsData }, { data: hospitalsData }, { data: packagesData }] =
    await Promise.all([
      supabasePublic.from("dv_doctors").select("*"),
      supabasePublic.from("dv_hospitals").select("*"),
      supabasePublic.from("dv_packages").select("*"),
    ]);

  const doctors: Doctor[] = (doctorsData as Doctor[]) || [];
  const hospitals: Hospital[] = (hospitalsData as Hospital[]) || [];
  const packages: Package[] = (packagesData as Package[]) || [];

  const filteredDoctors = query
    ? doctors.filter(
        (d) =>
          d.name.toLowerCase().includes(query) ||
          d.specialty.toLowerCase().includes(query) ||
          d.hospitals?.some((h) => h.toLowerCase().includes(query))
      )
    : doctors;

  const filteredHospitals = query
    ? hospitals.filter(
        (h) =>
          h.name.toLowerCase().includes(query) ||
          (h.city && h.city.toLowerCase().includes(query)) ||
          (h.country && h.country.toLowerCase().includes(query)) ||
          h.specialties?.some((s) => s.toLowerCase().includes(query))
      )
    : hospitals;

  const filteredPackages = query
    ? packages.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          (p.specialty && p.specialty.toLowerCase().includes(query))
      )
    : packages;

  const total =
    filteredDoctors.length + filteredHospitals.length + filteredPackages.length;

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
            defaultValue={q}
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
          {query ? `${total} results for "${q.trim()}"` : "Showing all results"}
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
                  <p className="text-sm text-muted">{doctor.hospitals?.join(" · ")} · {doctor.experience}</p>
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
                  <p className="text-sm text-muted">{hospital.specialties?.join(" · ")}</p>
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
                  key={pkg.slug}
                  href={`/packages/${pkg.slug}`}
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

        {query && total === 0 && (
          <p className="mt-10 text-muted">No results found. Try a different keyword.</p>
        )}
      </div>
    </section>
  );
}
