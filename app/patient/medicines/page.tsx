import Link from "next/link";

const medicines = [
  { name: "Atorvastatin 10mg", qty: "30 tablets", dosage: "Once daily" },
  { name: "Metformin 500mg", qty: "60 tablets", dosage: "Twice daily" },
  { name: "Vitamin D3 60K IU", qty: "4 capsules", dosage: "Weekly" },
];

const tracking = [
  { label: "Prescription received", time: "29 Aug, 9:00 AM", done: true },
  { label: "Order packed", time: "29 Aug, 11:30 AM", done: true },
  { label: "Out for delivery", time: "29 Aug, 2:15 PM", done: true },
  { label: "Delivered", time: "Estimated today, 6:00 PM", done: false },
];

export default function MedicinesPage() {
  return (
    <section className="bg-warm-white py-10 lg:py-16">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <Link href="/patient/dashboard" className="text-sm text-muted hover:text-teal">
          ← Back to dashboard
        </Link>

        <h1 className="mt-6 font-heading text-3xl font-semibold text-navy">
          Medicines
        </h1>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-border bg-white p-6 shadow-sm">
            <h2 className="font-heading text-lg font-semibold text-navy">
              Prescription
            </h2>
            <p className="mt-1 text-sm text-muted">Dr. Ananya Sharma · 28 Aug 2026</p>

            <div className="mt-6 space-y-3">
              {medicines.map((med) => (
                <div
                  key={med.name}
                  className="flex items-center justify-between rounded-md border border-border p-4"
                >
                  <div>
                    <p className="font-medium text-dark">{med.name}</p>
                    <p className="text-sm text-muted">{med.dosage}</p>
                  </div>
                  <span className="text-sm text-muted">{med.qty}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-white p-6 shadow-sm">
            <h2 className="font-heading text-lg font-semibold text-navy">
              Order tracking
            </h2>
            <div className="mt-6 space-y-0">
              {tracking.map((step, i) => (
                <div key={step.label} className="relative flex gap-4 pb-8 last:pb-0">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                        step.done ? "bg-teal text-white" : "bg-sage text-muted"
                      }`}
                    >
                      {step.done ? "✓" : i + 1}
                    </div>
                    {i < tracking.length - 1 && (
                      <div className="mt-2 h-full w-px bg-border" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-dark">{step.label}</p>
                    <p className="text-sm text-muted">{step.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
