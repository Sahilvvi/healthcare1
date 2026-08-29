import Link from "next/link";
import { doctors } from "../../lib/doctors";

export default function AdminDoctorsPage() {
  return (
    <section>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-semibold text-navy">Doctors</h1>
        <p className="text-sm text-muted">Verified specialists and availability</p>
      </div>

      <div className="grid gap-4">
        {doctors.map((doctor) => (
          <div
            key={doctor.slug}
            className="flex flex-col justify-between gap-4 rounded-lg border border-border bg-white p-5 shadow-sm sm:flex-row sm:items-center"
          >
            <div>
              <h3 className="font-heading font-semibold text-navy">{doctor.name}</h3>
              <p className="text-sm text-teal">{doctor.specialty}</p>
              <p className="text-sm text-muted">{doctor.experience} · {doctor.procedures} procedures</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="rounded-full bg-sage px-3 py-1 text-xs font-medium text-dark">
                {doctor.availability}
              </span>
              <Link
                href={`/doctors/${doctor.slug}`}
                className="text-sm font-medium text-teal hover:text-navy"
              >
                View profile →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
