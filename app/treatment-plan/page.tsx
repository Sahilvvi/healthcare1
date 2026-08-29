"use client";

import { useState } from "react";
import Link from "next/link";

const steps = [
  {
    number: "01",
    title: "What brings you to India?",
    description: "Choose the treatment category closest to your needs.",
    options: [
      "Cardiology",
      "Cancer Care",
      "Bones & Joints",
      "Neurology",
      "Organ Transplant",
      "Women's Health",
      "Dental",
      "Wellness Checkup",
    ],
  },
  {
    number: "02",
    title: "Tell us about your condition",
    description:
      "Share a short summary and upload any reports or prescriptions.",
    input: true,
  },
  {
    number: "03",
    title: "Let's find the right specialist",
    description: "We match you with verified doctors for your case.",
    options: ["Dr. Ananya Sharma — Cardiology", "Dr. Rajiv Menon — Orthopedics", "Dr. Priya Kulkarni — Oncology"],
  },
  {
    number: "04",
    title: "Review your treatment options",
    description: "Hospital, doctor, estimated cost, timeline and inclusions.",
    summary: true,
  },
  {
    number: "05",
    title: "Plan your journey",
    description: "Visa, travel, accommodation and care coordinator support.",
    options: ["I need visa assistance", "I need airport pickup", "I need accommodation near hospital"],
  },
  {
    number: "06",
    title: "Your care timeline",
    description: "Treatment, recovery and follow-up at a glance.",
    timeline: true,
  },
];

const timelineItems = [
  { label: "Medical Evaluation", days: "Day 1" },
  { label: "Consultation", days: "Day 2" },
  { label: "Treatment", days: "Day 3–5" },
  { label: "Recovery", days: "Day 6–14" },
  { label: "Follow-up", days: "Day 15+" },
];

export default function TreatmentPlanPage() {
  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState<Record<number, string>>({});

  const current = steps[step];

  function select(value: string) {
    setSelections((prev) => ({ ...prev, [step]: value }));
  }

  function next() {
    if (step < steps.length - 1) setStep((s) => s + 1);
  }

  function back() {
    if (step > 0) setStep((s) => s - 1);
  }

  return (
    <section className="bg-warm-white py-16 lg:py-24">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-teal">
              Your Treatment Plan
            </p>
            <h1 className="mt-2 font-heading text-3xl font-semibold text-navy md:text-4xl">
              {current.title}
            </h1>
            <p className="mt-3 text-muted">{current.description}</p>
          </div>
          <span className="hidden text-4xl font-light text-sage md:block">
            {current.number}
          </span>
        </div>

        <div className="mb-10 h-1.5 w-full overflow-hidden rounded-full bg-sage">
          <div
            className="h-full bg-navy transition-all duration-500"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>

        <div className="rounded-lg border border-border bg-white p-6 shadow-sm lg:p-10">
          {current.options && (
            <div className="grid gap-3 sm:grid-cols-2">
              {current.options.map((option) => {
                const selected = selections[step] === option;
                return (
                  <button
                    key={option}
                    onClick={() => select(option)}
                    className={`rounded-md border px-5 py-4 text-left transition-all ${
                      selected
                        ? "border-navy bg-navy/5 text-navy"
                        : "border-border bg-white text-dark hover:border-teal hover:text-teal"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          )}

          {current.input && (
            <div className="space-y-4">
              <textarea
                rows={5}
                placeholder="Briefly describe your symptoms, diagnosis or previous treatment..."
                className="w-full rounded-md border border-border bg-warm-white p-4 text-dark placeholder:text-muted focus:border-teal focus:outline-none"
              />
              <div className="rounded-md border border-dashed border-border bg-warm-white p-8 text-center">
                <p className="text-sm font-medium text-dark">Upload medical reports</p>
                <p className="mt-1 text-xs text-muted">
                  Drag and drop files here, or click to browse
                </p>
              </div>
            </div>
          )}

          {current.summary && (
            <div className="space-y-4">
              <div className="rounded-md border border-border p-5">
                <p className="text-sm text-muted">Recommended plan</p>
                <h3 className="mt-1 font-heading text-xl font-semibold text-navy">
                  Knee Replacement Package
                </h3>
                <ul className="mt-4 space-y-2 text-sm text-muted">
                  <li>Doctor: Dr. Rajiv Menon — Orthopedics</li>
                  <li>Hospital: Apollo Chennai</li>
                  <li>Estimated cost: $4,800</li>
                  <li>Stay: 10–14 days</li>
                  <li>Includes consultation, surgery, hospital stay, follow-up & care coordination</li>
                </ul>
              </div>
            </div>
          )}

          {current.timeline && (
            <div className="space-y-0">
              {timelineItems.map((item, i) => (
                <div key={item.label} className="relative flex gap-6 pb-8 last:pb-0">
                  <div className="flex flex-col items-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-navy text-xs font-semibold text-white">
                      {i + 1}
                    </div>
                    {i < timelineItems.length - 1 && (
                      <div className="mt-2 h-full w-px bg-border" />
                    )}
                  </div>
                  <div>
                    <p className="font-heading font-semibold text-navy">{item.label}</p>
                    <p className="text-sm text-muted">{item.days}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-10 flex items-center justify-between">
            <button
              onClick={back}
              disabled={step === 0}
              className="text-sm font-medium text-muted hover:text-dark disabled:cursor-not-allowed disabled:opacity-40"
            >
              Back
            </button>
            {step < steps.length - 1 ? (
              <button
                onClick={next}
                className="rounded-md bg-navy px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-teal"
              >
                Continue
              </button>
            ) : (
              <Link
                href="/patient/dashboard"
                className="rounded-md bg-navy px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-teal"
              >
                Go to Dashboard
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
