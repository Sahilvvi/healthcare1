import Link from "next/link";
import Image from "next/image";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import type { Package } from "../lib/types";

const fallbackPackages: Package[] = [
  {
    id: "1",
    slug: "knee-replacement",
    name: "Knee Replacement",
    country: "India",
    price: "$4,800",
    stay: "10–14 days",
    specialty: "orthopedics",
    description: null,
    includes: ["Specialist consultation", "Surgery", "Hospital stay", "Follow-up", "Care coordination"],
    hospitals: [],
  },
  {
    id: "2",
    slug: "cardiac-bypass",
    name: "Cardiac Bypass",
    country: "India",
    price: "$7,200",
    stay: "12–16 days",
    specialty: "cardiology",
    description: null,
    includes: ["Cardiologist consultation", "Procedure", "Intensive care", "Rehabilitation plan", "Travel support"],
    hospitals: [],
  },
  {
    id: "3",
    slug: "liver-transplant",
    name: "Liver Transplant",
    country: "India",
    price: "On request",
    stay: "30–45 days",
    specialty: "transplants",
    description: null,
    includes: ["Transplant evaluation", "Surgery & post-op care", "Donor coordination", "Accommodation support", "Long-term follow-up"],
    hospitals: [],
  },
];

const packageImages: Record<string, string> = {
  "knee-replacement": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=800",
  "cardiac-bypass": "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800",
  "liver-transplant": "https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&q=80&w=800",
};

export function TreatmentPackages({ packages }: { packages?: Package[] }) {
  const displayPackages = packages?.length ? packages : fallbackPackages;
  return (
    <section id="packages" className="bg-sage/20 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-teal">Transparent pricing</p>
            <h2 className="mt-3 font-heading text-4xl font-semibold text-navy md:text-5xl">
              Treatment packages
            </h2>
            <p className="mt-4 text-lg text-muted">
              All-inclusive estimates so you can plan your medical travel with confidence.
            </p>
          </div>
          <Link href="/packages" className="group inline-flex items-center gap-1 text-base font-medium text-teal hover:text-navy">
            View all packages <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {displayPackages.map((pkg, i) => (
            <div
              key={pkg.name}
              className={`group flex flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm card-hover ${
                i === 1 ? "ring-2 ring-teal/20 lg:-mt-4 lg:mb-4" : ""
              }`}
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                  src={packageImages[pkg.slug] || "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800"}
                  alt={pkg.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent" />
                {i === 1 && (
                  <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-teal px-3 py-1 text-xs font-semibold text-white">
                    <Sparkles className="h-3 w-3" /> Most popular
                  </span>
                )}
                <span className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-navy backdrop-blur">
                  {pkg.stay}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted">{pkg.country}</p>
                    <h3 className="mt-1 font-heading text-xl font-semibold text-navy">{pkg.name}</h3>
                  </div>
                </div>
                <p className="mt-4 font-heading text-3xl font-semibold text-navy">{pkg.price}</p>
                <p className="text-sm text-muted">Starting from</p>
                <ul className="mt-4 flex-1 space-y-2">
                  {pkg.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
                      <span className="text-dark">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/packages/${pkg.slug}`}
                  className="btn-primary mt-6 block rounded-xl border border-navy bg-navy px-5 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-teal"
                >
                  View Treatment Plan
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
