import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { hospitals } from "../../lib/hospitals";

export function generateStaticParams() {
  return hospitals.map((hospital) => ({ slug: hospital.slug }));
}

export default async function HospitalProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const hospital = hospitals.find((h) => h.slug === slug);
  if (!hospital) notFound();

  return (
    <section className="bg-warm-white py-16 lg:py-24">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <Link href="/hospitals" className="text-sm text-muted hover:text-teal">
          ← Back to hospitals
        </Link>

        <div className="mt-8 overflow-hidden rounded-lg border border-border bg-white">
          <div className="aspect-[21/9] overflow-hidden bg-sage">
            <Image
              src={hospital.image}
              alt={hospital.name}
              width={1200}
              height={514}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="p-6 lg:p-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div>
                <h1 className="font-heading text-3xl font-semibold text-navy">
                  {hospital.name}
                </h1>
                <p className="text-muted">
                  {hospital.city}, {hospital.country}
                </p>
              </div>
              <Link
                href="/treatment-plan"
                className="rounded-md bg-navy px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal"
              >
                Request treatment estimate
              </Link>
            </div>

            <div className="mt-8 grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <h2 className="font-heading text-lg font-semibold text-navy">
                  About
                </h2>
                <p className="mt-3 leading-relaxed text-muted">
                  {hospital.about}
                </p>

                <h2 className="mt-8 font-heading text-lg font-semibold text-navy">
                  Specialties
                </h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {hospital.specialties.map((s) => (
                    <span
                      key={s}
                      className="rounded-md border border-border bg-warm-white px-3 py-1.5 text-sm text-dark"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <h2 className="mt-8 font-heading text-lg font-semibold text-navy">
                  Facilities
                </h2>
                <ul className="mt-3 list-disc space-y-1 pl-4 text-sm text-muted">
                  {hospital.facilities.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-lg border border-border bg-warm-white p-6">
                <h2 className="font-heading font-semibold text-navy">
                  Quick facts
                </h2>
                <div className="mt-4 space-y-3 text-sm">
                  <div>
                    <p className="text-muted">Beds</p>
                    <p className="font-medium text-dark">{hospital.beds}</p>
                  </div>
                  <div>
                    <p className="text-muted">Accreditations</p>
                    <p className="font-medium text-dark">
                      {hospital.accreditations.join(" · ")}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted">Location</p>
                    <p className="font-medium text-dark">
                      {hospital.city}, {hospital.country}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
