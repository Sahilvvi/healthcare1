import Link from "next/link";
import { hospitals } from "../../lib/hospitals";

export default function AdminHospitalsPage() {
  return (
    <section>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-semibold text-navy">Hospitals</h1>
        <p className="text-sm text-muted">Accredited centres and international patient services</p>
      </div>

      <div className="grid gap-4">
        {hospitals.map((hospital) => (
          <div
            key={hospital.slug}
            className="flex flex-col justify-between gap-4 rounded-lg border border-border bg-white p-5 shadow-sm sm:flex-row sm:items-center"
          >
            <div>
              <h3 className="font-heading font-semibold text-navy">{hospital.name}</h3>
              <p className="text-sm text-muted">{hospital.city}, {hospital.country}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {hospital.accreditations.map((acc) => (
                  <span key={acc} className="rounded-md border border-border bg-warm-white px-2 py-1 text-xs text-dark">
                    {acc}
                  </span>
                ))}
              </div>
            </div>
            <Link
              href={`/hospitals/${hospital.slug}`}
              className="text-sm font-medium text-teal hover:text-navy"
            >
              View profile →
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
