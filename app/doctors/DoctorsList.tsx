"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import type { Doctor } from "@/app/lib/types";

const filters = ["All", "Cardiology", "Orthopedics", "Oncology", "Neurology"];

const specialtyAliases: Record<string, string> = {
  cardiology: "Cardiology",
  orthopedics: "Orthopedics",
  oncology: "Oncology",
  neurology: "Neurology",
  "cancer-care": "Oncology",
  "women-health": "Neurology",
  "womens-health": "Neurology",
  transplants: "Cardiology",
  dental: "Cardiology",
  wellness: "Neurology",
};

function normalizeFilter(value?: string | null) {
  if (!value) return "All";
  const normalized = specialtyAliases[value.toLowerCase()] || (filters.includes(value) ? value : null);
  return normalized || "All";
}

export default function DoctorsList({ doctors, initialFilter = "All" }: { doctors: Doctor[]; initialFilter?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeFilter = useMemo(() => {
    const fromUrl = normalizeFilter(searchParams.get("specialty"));
    if (fromUrl !== "All") return fromUrl;
    return normalizeFilter(initialFilter);
  }, [searchParams, initialFilter]);

  const filteredDoctors =
    activeFilter === "All"
      ? doctors
      : doctors.filter((doctor) => doctor.specialty?.toLowerCase() === activeFilter.toLowerCase());

  function selectFilter(filter: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (filter === "All") {
      params.delete("specialty");
    } else {
      params.set("specialty", filter);
    }
    router.push(`/doctors${params.toString() ? `?${params.toString()}` : ""}`, { scroll: false });
  }

  return (
    <section className="bg-warm-white py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-teal">
            Find a specialist
          </p>
          <h1 className="mt-2 font-heading text-3xl font-semibold text-navy md:text-4xl">
            Verified doctors for international care
          </h1>
          <p className="mt-3 text-muted">
            Filter by specialty, language and availability. Every doctor is
            background-checked and reviewed by our medical team.
          </p>
        </div>

        <div className="mb-10 flex flex-wrap gap-3 text-sm">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => selectFilter(filter)}
              className={`rounded-full border px-4 py-2 transition-colors ${
                filter === activeFilter
                  ? "border-navy bg-navy text-white"
                  : "border-border bg-white text-dark hover:border-teal hover:text-teal"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {filteredDoctors.map((doctor) => (
            <div
              key={doctor.slug}
              className="group flex flex-col overflow-hidden rounded-lg border border-border bg-white shadow-sm transition-all hover:shadow-md sm:flex-row"
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-sage sm:w-48 sm:aspect-auto">
                <Image
                  src={doctor.image}
                  alt={doctor.name}
                  width={400}
                  height={400}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-heading text-lg font-semibold text-navy">
                        {doctor.name}
                      </h3>
                      <p className="text-sm text-teal">{doctor.specialty}</p>
                    </div>
                    <span className="flex items-center gap-1 rounded-full bg-champagne/40 px-2 py-1 text-xs font-medium text-navy">
                      <StarIcon />
                      {doctor.rating ?? "-"}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted">
                    <span>{doctor.experience} experience</span>
                    <span>{doctor.procedures} procedures</span>
                  </div>
                  <p className="mt-3 text-sm text-muted">
                    Languages: {doctor.languages?.join(" · ")}
                  </p>
                  <p className="mt-3 text-sm text-muted">{doctor.availability}</p>
                </div>
                <div className="mt-6 flex gap-3">
                  <Link
                    href={`/doctors/${doctor.slug}`}
                    className="flex-1 rounded-md border border-border px-4 py-2.5 text-center text-sm font-medium text-dark transition-colors hover:border-navy hover:text-navy"
                  >
                    View Profile
                  </Link>
                  <Link
                    href={`/book/${doctor.slug}`}
                    className="flex-1 rounded-md bg-navy px-4 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-teal"
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
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="text-navy"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}
