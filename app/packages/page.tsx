import Link from "next/link";
import { packages } from "../lib/packages";

export default function PackagesPage() {
  return (
    <section className="bg-warm-white py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-12 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-teal">
            All-inclusive estimates
          </p>
          <h1 className="mt-2 font-heading text-3xl font-semibold text-navy md:text-4xl">
            Transparent treatment packages
          </h1>
          <p className="mt-3 text-muted">
            Bundled pricing for common procedures so you can plan your medical
            travel with confidence. Final costs are confirmed after medical
            review.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {packages.map((pkg) => (
            <div
              key={pkg.slug}
              className="group flex flex-col rounded-lg border border-border bg-white p-6 shadow-sm transition-all hover:border-teal/30 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted">{pkg.country}</p>
                  <h2 className="mt-1 font-heading text-xl font-semibold text-navy">
                    {pkg.name}
                  </h2>
                  <p className="text-sm text-teal">{pkg.specialty}</p>
                </div>
                <span className="rounded-full bg-sage px-3 py-1 text-xs font-medium text-navy">
                  {pkg.stay}
                </span>
              </div>
              <p className="mt-6 font-heading text-3xl font-semibold text-navy">
                {pkg.price}
              </p>
              <p className="text-sm text-muted">Starting from</p>
              <ul className="mt-6 flex-1 space-y-3">
                {pkg.includes.slice(0, 5).map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm">
                    <CheckIcon />
                    <span className="text-dark">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={`/packages/${pkg.slug}`}
                className="mt-8 block rounded-md border border-navy bg-navy px-5 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-teal"
              >
                View package
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#0F766E"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
