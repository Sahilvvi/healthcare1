import { notFound } from "next/navigation";
import Link from "next/link";
import { supabasePublic } from "@/app/lib/supabase/public";
import type { Package } from "@/app/lib/types";

export default async function PackageDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data, error } = await supabasePublic
    .from("dv_packages")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    console.error("Failed to fetch package:", error?.message);
    notFound();
  }

  const pkg = data as Package;

  return (
    <section className="bg-warm-white py-16 lg:py-24">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <Link href="/packages" className="text-sm text-muted hover:text-teal">
          ← All packages
        </Link>

        <div className="mt-6 rounded-lg border border-border bg-white p-6 shadow-sm lg:p-10">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <p className="text-sm font-medium text-muted">{pkg.country}</p>
              <h1 className="mt-1 font-heading text-3xl font-semibold text-navy md:text-4xl">
                {pkg.name}
              </h1>
              <p className="mt-1 text-sm text-teal">{pkg.specialty}</p>
            </div>
            <div className="text-left sm:text-right">
              <p className="font-heading text-3xl font-semibold text-navy">{pkg.price}</p>
              <p className="text-sm text-muted">Starting from</p>
            </div>
          </div>

          <p className="mt-6 text-muted">{pkg.description}</p>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-md border border-border bg-warm-white p-5">
              <h2 className="font-heading font-semibold text-navy">What’s included</h2>
              <ul className="mt-4 space-y-3">
                {pkg.includes?.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-dark">
                    <CheckIcon />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-md border border-border bg-warm-white p-5">
              <h2 className="font-heading font-semibold text-navy">Package details</h2>
              <ul className="mt-4 space-y-3 text-sm">
                <li className="flex justify-between text-dark">
                  <span className="text-muted">Estimated stay</span>
                  <span className="font-medium">{pkg.stay}</span>
                </li>
                <li className="flex justify-between text-dark">
                  <span className="text-muted">Available hospitals</span>
                  <span className="font-medium">{pkg.hospitals?.length ?? 0}</span>
                </li>
                <li className="flex justify-between text-dark">
                  <span className="text-muted">Medical review</span>
                  <span className="font-medium">Included</span>
                </li>
                <li className="flex justify-between text-dark">
                  <span className="text-muted">Care coordinator</span>
                  <span className="font-medium">Assigned</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="font-heading font-semibold text-navy">Recommended hospitals</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {pkg.hospitals?.map((hospital) => (
                <Link
                  key={hospital}
                  href="/hospitals"
                  className="rounded-md border border-border bg-warm-white p-4 text-sm font-medium text-dark transition-colors hover:border-teal hover:text-navy"
                >
                  {hospital} →
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-4 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted">
              Final pricing depends on medical review and your specific case.
            </p>
            <div className="flex gap-3">
              <Link
                href="/patient/case"
                className="rounded-md bg-navy px-6 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-teal"
              >
                Get a quote
              </Link>
              <Link
                href="/doctors"
                className="rounded-md border border-border bg-white px-6 py-3 text-center text-sm font-medium text-dark transition-colors hover:border-navy"
              >
                Find a doctor
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0F766E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
