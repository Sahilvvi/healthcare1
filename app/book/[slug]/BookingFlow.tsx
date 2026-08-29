"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Doctor } from "../../lib/doctors";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const slots = ["09:00 AM", "10:30 AM", "12:00 PM", "02:00 PM", "04:30 PM"];

export function BookingFlow({ doctor }: { doctor: Doctor }) {
  const [step, setStep] = useState(1);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    notes: "",
  });

  const handleNext = () => {
    if (step === 1 && selectedSlot) setStep(2);
    if (step === 2 && form.name && form.email && form.phone) setStep(3);
  };

  return (
    <section className="bg-warm-white py-16 lg:py-24">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <Link
          href={`/doctors/${doctor.slug}`}
          className="text-sm text-muted hover:text-teal"
        >
          ← Back to profile
        </Link>

        <div className="mt-8 rounded-lg border border-border bg-white p-6 lg:p-8">
          <div className="flex items-start gap-4">
            <div className="aspect-square w-16 overflow-hidden rounded-md bg-sage">
              <Image
                src={doctor.image}
                alt={doctor.name}
                width={120}
                height={120}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h1 className="font-heading text-2xl font-semibold text-navy">
                Book consultation
              </h1>
              <p className="text-sm text-muted">
                {doctor.name} · {doctor.specialty}
              </p>
              <p className="mt-1 text-sm font-medium text-teal">
                $45 USD · {doctor.availability}
              </p>
            </div>
          </div>

          <div className="mt-8 border-b border-border pb-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full ${
                  step >= 1 ? "bg-navy text-white" : "bg-sage text-navy"
                }`}
              >
                1
              </span>
              <span className={step >= 1 ? "text-navy" : "text-muted"}>
                Select slot
              </span>
              <span className="mx-2 text-border">—</span>
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full ${
                  step >= 2 ? "bg-navy text-white" : "bg-sage text-navy"
                }`}
              >
                2
              </span>
              <span className={step >= 2 ? "text-navy" : "text-muted"}>
                Your details
              </span>
              <span className="mx-2 text-border">—</span>
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full ${
                  step >= 3 ? "bg-navy text-white" : "bg-sage text-navy"
                }`}
              >
                3
              </span>
              <span className={step >= 3 ? "text-navy" : "text-muted"}>
                Confirm
              </span>
            </div>
          </div>

          {step === 1 && (
            <div className="mt-8 space-y-6">
              <h2 className="font-heading text-lg font-semibold text-navy">
                Choose a convenient time
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {days.map((day) =>
                  slots.map((time) => {
                    const value = `${day}, ${time}`;
                    const active = selectedSlot === value;
                    return (
                      <button
                        key={value}
                        onClick={() => setSelectedSlot(value)}
                        className={`rounded-md border px-4 py-3 text-left text-sm transition-colors ${
                          active
                            ? "border-navy bg-navy text-white"
                            : "border-border bg-white text-dark hover:border-teal hover:text-teal"
                        }`}
                      >
                        <span className="font-medium">{day}</span>
                        <span className={`ml-2 ${active ? "text-white/80" : "text-muted"}`}>
                          {time}
                        </span>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="mt-8 space-y-5">
              <h2 className="font-heading text-lg font-semibold text-navy">
                Patient details
              </h2>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-dark">
                    Full name
                  </label>
                  <input
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-teal"
                    placeholder="Sarah Thompson"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark">
                    Email
                  </label>
                  <input
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-teal"
                    placeholder="sarah@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark">
                    Phone
                  </label>
                  <input
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-teal"
                    placeholder="+1 234 567 890"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark">
                    Country
                  </label>
                  <input
                    value={form.country}
                    onChange={(e) =>
                      setForm({ ...form, country: e.target.value })
                    }
                    className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-teal"
                    placeholder="USA"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-dark">
                  Notes for the doctor
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) =>
                    setForm({ ...form, notes: e.target.value })
                  }
                  className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-teal"
                  rows={3}
                  placeholder="Briefly describe your symptoms or reason for consultation..."
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="mt-8 space-y-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sage">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#0F766E"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
              <h2 className="font-heading text-2xl font-semibold text-navy">
                Booking confirmed
              </h2>
              <p className="text-muted">
                Your video consultation with {doctor.name} is scheduled for{" "}
                <strong className="text-dark">{selectedSlot}</strong>.
              </p>
              <p className="text-sm text-muted">
                A confirmation email has been sent to {form.email}. Your care
                coordinator will reach out shortly.
              </p>
              <Link
                href="/patient/dashboard"
                className="inline-block rounded-md bg-navy px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-teal"
              >
                Go to Patient Dashboard
              </Link>
            </div>
          )}

          {step < 3 && (
            <div className="mt-8 flex justify-between">
              <button
                onClick={() => setStep(Math.max(1, step - 1))}
                disabled={step === 1}
                className="rounded-md border border-border px-5 py-2.5 text-sm font-medium text-dark transition-colors hover:border-navy disabled:opacity-40"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={
                  (step === 1 && !selectedSlot) ||
                  (step === 2 && !(form.name && form.email && form.phone))
                }
                className="rounded-md bg-navy px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal disabled:opacity-50"
              >
                Continue
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
