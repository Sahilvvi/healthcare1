import Image from "next/image";
import Link from "next/link";
import { doctors } from "../../lib/doctors";

export function generateStaticParams() {
  return doctors.map((doctor) => ({ slug: doctor.slug }));
}

export default async function DoctorProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doctor = doctors.find((d) => d.slug === slug);
  if (!doctor) return null;

  return (
    <section className="bg-warm-white py-16 lg:py-24">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <Link href="/doctors" className="text-sm text-muted hover:text-teal">
          ← Back to doctors
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <div className="aspect-[4/3] overflow-hidden rounded-lg bg-sage">
              <Image
                src={doctor.image}
                alt={doctor.name}
                width={600}
                height={450}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="mt-6 rounded-lg border border-border bg-white p-6">
              <p className="text-sm text-muted">Consultation fee</p>
              <p className="font-heading text-2xl font-semibold text-navy">
                $45 USD
              </p>
              <p className="mt-1 text-sm text-muted">{doctor.availability}</p>
              <Link
                href={`/book/${doctor.slug}`}
                className="mt-5 block rounded-md bg-navy px-4 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-teal"
              >
                Book Consultation
              </Link>
              <Link
                href="/treatment-plan"
                className="mt-3 block rounded-md border border-border px-4 py-3 text-center text-sm font-medium text-dark transition-colors hover:border-navy hover:text-navy"
              >
                Request Treatment Opinion
              </Link>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-lg border border-border bg-white p-6 lg:p-8">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="font-heading text-3xl font-semibold text-navy">
                    {doctor.name}
                  </h1>
                  <p className="mt-1 text-teal">{doctor.specialty}</p>
                </div>
                <span className="flex items-center gap-1 rounded-full bg-champagne/40 px-3 py-1 text-sm font-medium text-navy">
                  <StarIcon />
                  {doctor.rating}
                </span>
              </div>

              <p className="mt-6 leading-relaxed text-muted">{doctor.about}</p>

              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                <div>
                  <h3 className="font-heading font-semibold text-navy">
                    Qualifications
                  </h3>
                  <ul className="mt-3 list-disc space-y-1 pl-4 text-sm text-muted">
                    {doctor.qualifications.map((q) => (
                      <li key={q}>{q}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-navy">
                    Areas of expertise
                  </h3>
                  <ul className="mt-3 list-disc space-y-1 pl-4 text-sm text-muted">
                    {doctor.expertise.map((e) => (
                      <li key={e}>{e}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="font-heading font-semibold text-navy">
                  Associated hospitals
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {doctor.hospitals.map((h) => (
                    <span
                      key={h}
                      className="rounded-md border border-border bg-warm-white px-3 py-1.5 text-sm text-dark"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <h3 className="font-heading font-semibold text-navy">Languages</h3>
                <p className="mt-2 text-sm text-muted">
                  {doctor.languages.join(" · ")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StarIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="text-navy"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}
