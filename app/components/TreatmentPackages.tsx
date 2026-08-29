import Link from "next/link";

const packages = [
  {
    name: "Knee Replacement",
    country: "India",
    price: "$4,800",
    stay: "10–14 days",
    includes: [
      "Specialist consultation",
      "Surgery",
      "Hospital stay",
      "Follow-up",
      "Care coordination",
    ],
  },
  {
    name: "Cardiac Bypass",
    country: "India",
    price: "$7,200",
    stay: "12–16 days",
    includes: [
      "Cardiologist consultation",
      "Procedure",
      "Intensive care",
      "Rehabilitation plan",
      "Travel support",
    ],
  },
  {
    name: "Liver Transplant",
    country: "India",
    price: "On request",
    stay: "30–45 days",
    includes: [
      "Transplant evaluation",
      "Surgery & post-op care",
      "Donor coordination",
      "Accommodation support",
      "Long-term follow-up",
    ],
  },
];

export function TreatmentPackages() {
  return (
    <section id="packages" className="bg-warm-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <h2 className="font-heading text-3xl font-semibold text-navy md:text-4xl">
              Transparent treatment packages
            </h2>
            <p className="mt-4 text-muted">
              All-inclusive estimates so you can plan your medical travel with
              confidence.
            </p>
          </div>
          <Link
            href="#"
            className="text-base font-medium text-teal hover:text-navy"
          >
            View all packages →
          </Link>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {packages.map((pkg) => (
            <div
              key={pkg.name}
              className="group flex flex-col rounded-lg border border-border bg-white p-6 shadow-sm transition-all duration-300 hover:border-teal/30 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted">{pkg.country}</p>
                  <h3 className="mt-1 font-heading text-xl font-semibold text-navy">
                    {pkg.name}
                  </h3>
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
                {pkg.includes.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm">
                    <CheckIcon />
                    <span className="text-dark">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="#"
                className="mt-8 block rounded-md border border-navy bg-navy px-5 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-teal"
              >
                View Treatment Plan
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
