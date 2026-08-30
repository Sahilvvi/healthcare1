import { ShieldCheck, FileCheck, Lock, Globe, Award, Headphones } from "lucide-react";

const items = [
  { title: "Verified doctors", description: "Credentials reviewed before onboarding.", icon: ShieldCheck },
  { title: "Accredited hospitals", description: "Partners accredited by NABH and JCI.", icon: Award },
  { title: "Fixed price estimates", description: "Transparent cost summaries before you book.", icon: FileCheck },
  { title: "Data privacy", description: "End-to-end encrypted records and messages.", icon: Lock },
  { title: "Global care coordination", description: "Visa, travel and stay support included.", icon: Globe },
  { title: "24/7 support", description: "Reach a care coordinator any time.", icon: Headphones },
];

export function TrustSection() {
  return (
    <section className="border-y border-border bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-teal">Why families trust us</p>
          <h2 className="mt-3 font-heading text-3xl font-semibold text-navy md:text-4xl">
            Built for safe and transparent medical travel
          </h2>
        </div>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="group flex items-start gap-5 rounded-2xl border border-border bg-warm-white p-6 transition-shadow duration-300 hover:shadow-md">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sage text-teal transition-transform duration-300 group-hover:scale-110">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-navy">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
