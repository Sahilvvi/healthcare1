"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/app/lib/supabase/client";
import { submitCase } from "./actions";

const categories = [
  "Cardiology",
  "Cancer Care",
  "Orthopedics",
  "Neurology",
  "Organ Transplant",
  "Women's Health",
  "Dental",
  "Wellness Checkup",
];

const steps = [
  { label: "Your details", description: "Tell us who you are" },
  { label: "Medical details", description: "Share your condition" },
  { label: "Review", description: "Confirm and submit" },
];

export default function PatientCasePage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    country: "",
    city: "",
    category: "",
    condition: "",
    previousTreatment: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submittedError, setSubmittedError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function updateField(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function canProceed() {
    if (step === 0) {
      return (
        form.name &&
        form.email &&
        form.password.length >= 6 &&
        form.confirmPassword &&
        form.password === form.confirmPassword &&
        form.country
      );
    }
    if (step === 1) {
      return form.category && form.condition;
    }
    return true;
  }

  async function handleSubmit(e?: React.FormEvent<HTMLFormElement>) {
    e?.preventDefault();
    setError(null);
    setSubmittedError(null);

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const fd = new FormData();
    Object.entries(form).forEach(([key, value]) => fd.append(key, value));

    const result = await submitCase(fd);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    if (!result.isNew) {
      router.push("/patient/dashboard");
      router.refresh();
      return;
    }

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    if (signInError) {
      setSubmittedError("Account and case created, but automatic sign-in failed. Please sign in below.");
      setSubmitted(true);
      setLoading(false);
      return;
    }

    router.push("/patient/dashboard");
    router.refresh();
  }

  if (submitted) {
    return (
      <section className="bg-warm-white py-16 lg:py-24">
        <div className="mx-auto max-w-2xl px-6 text-center lg:px-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sage">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0F766E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
          <h1 className="mt-6 font-heading text-3xl font-semibold text-navy">Case received</h1>
          <p className="mt-3 text-muted">
            Thank you for sharing your case. A care coordinator will review your details and reach out within 24 hours with a medical opinion and estimated treatment plan.
          </p>
          {submittedError && (
            <p className="mt-4 rounded-md bg-amber-50 px-4 py-3 text-sm text-amber-800">
              {submittedError}
            </p>
          )}
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {submittedError ? (
              <Link href="/login" className="rounded-md bg-navy px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal">
                Sign in
              </Link>
            ) : (
              <Link href="/patient/dashboard" className="rounded-md bg-navy px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal">
                Go to dashboard
              </Link>
            )}
            <Link href="/doctors" className="rounded-md border border-border bg-white px-6 py-2.5 text-sm font-medium text-dark transition-colors hover:border-navy">
              Browse doctors
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-warm-white py-10 lg:py-16">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/patient/dashboard" className="text-sm text-muted hover:text-teal">
            ← Back to dashboard
          </Link>
          <h1 className="mt-6 font-heading text-3xl font-semibold text-navy md:text-4xl">
            Share your case
          </h1>
          <p className="mt-2 max-w-2xl text-muted">
            Tell us about your condition. Your information is encrypted and only shared with your assigned medical team.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-3">
          <aside className="order-first lg:order-none">
            <div className="rounded-lg border border-border bg-white p-6 shadow-sm lg:sticky lg:top-24">
              <p className="font-heading text-lg font-semibold text-navy">Your care journey starts here</p>
              <p className="mt-2 text-sm text-muted">
                Complete this short form so our medical team can prepare a personalized treatment plan and cost estimate.
              </p>
              <div className="mt-6 space-y-6">
                {steps.map((s, i) => (
                  <div key={s.label} className="flex items-start gap-4">
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                        i < step
                          ? "bg-teal text-white"
                          : i === step
                          ? "border-2 border-navy bg-white text-navy"
                          : "bg-sage text-muted"
                      }`}
                    >
                      {i < step ? "✓" : i + 1}
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${i === step ? "text-navy" : "text-muted"}`}>{s.label}</p>
                      <p className="text-xs text-muted">{s.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 rounded-md bg-sage/30 p-4 text-sm text-dark">
                <div className="flex items-center gap-2 font-medium text-teal">
                  <LockIcon />
                  Private & encrypted
                </div>
                <p className="mt-1 text-xs text-muted">
                  Only your assigned coordinator and medical team can view these details.
                </p>
              </div>
            </div>
          </aside>

          <div className="lg:col-span-2">
            {error && (
              <p className="mb-6 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-white p-6 shadow-sm lg:p-10">
              {step === 0 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-heading text-xl font-semibold text-navy">Your details</h2>
                    <p className="mt-1 text-sm text-muted">We need this to create your secure account and coordinate your care.</p>
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <Input label="Full name" value={form.name} onChange={(v) => updateField("name", v)} placeholder="Sarah Johnson" required />
                    <Input label="Email" type="email" value={form.email} onChange={(v) => updateField("email", v)} placeholder="you@example.com" required />
                    <Input label="Password" type="password" value={form.password} onChange={(v) => updateField("password", v)} placeholder="••••••••" required minLength={6} />
                    <Input label="Confirm password" type="password" value={form.confirmPassword} onChange={(v) => updateField("confirmPassword", v)} placeholder="••••••••" required minLength={6} />
                    <Input label="Phone" type="tel" value={form.phone} onChange={(v) => updateField("phone", v)} placeholder="+1 555 123 4567" />
                    <Input label="Your country" value={form.country} onChange={(v) => updateField("country", v)} placeholder="USA" required />
                    <Input label="Preferred city in India" value={form.city} onChange={(v) => updateField("city", v)} placeholder="Chennai" />
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-heading text-xl font-semibold text-navy">Medical details</h2>
                    <p className="mt-1 text-sm text-muted">The more detail you share, the better our team can tailor your plan.</p>
                  </div>
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-dark">Treatment category</label>
                    <select
                      id="category"
                      value={form.category}
                      onChange={(e) => updateField("category", e.target.value)}
                      required
                      className="mt-2 w-full rounded-md border border-border bg-warm-white px-4 py-2.5 text-sm text-dark outline-none focus:border-teal"
                    >
                      <option value="">Select a category</option>
                      {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="condition" className="block text-sm font-medium text-dark">Describe your condition</label>
                    <textarea
                      id="condition"
                      value={form.condition}
                      onChange={(e) => updateField("condition", e.target.value)}
                      placeholder="Symptoms, diagnosis, duration, current medications..."
                      rows={5}
                      required
                      className="mt-2 w-full rounded-md border border-border bg-warm-white px-4 py-3 text-sm text-dark outline-none focus:border-teal"
                    />
                  </div>
                  <div>
                    <label htmlFor="previousTreatment" className="block text-sm font-medium text-dark">Previous treatment (optional)</label>
                    <textarea
                      id="previousTreatment"
                      value={form.previousTreatment}
                      onChange={(e) => updateField("previousTreatment", e.target.value)}
                      placeholder="Surgeries, therapies, medications already tried..."
                      rows={3}
                      className="mt-2 w-full rounded-md border border-border bg-warm-white px-4 py-3 text-sm text-dark outline-none focus:border-teal"
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-heading text-xl font-semibold text-navy">Review your case</h2>
                    <p className="mt-1 text-sm text-muted">Please confirm your details before submitting.</p>
                  </div>
                  <div className="divide-y divide-border rounded-lg border border-border bg-warm-white">
                    <ReviewRow label="Full name" value={form.name} />
                    <ReviewRow label="Email" value={form.email} />
                    <ReviewRow label="Phone" value={form.phone || "—"} />
                    <ReviewRow label="Country" value={form.country} />
                    <ReviewRow label="Preferred city" value={form.city || "—"} />
                    <ReviewRow label="Category" value={form.category} />
                    <ReviewRow label="Condition" value={form.condition} />
                    <ReviewRow label="Previous treatment" value={form.previousTreatment || "—"} last />
                  </div>
                  <div className="rounded-md bg-sage/30 p-4 text-sm text-dark">
                    <div className="flex items-start gap-3">
                      <LockIcon />
                      <p>
                        By submitting, you agree to share these details with your assigned care coordinator and medical team for the purpose of preparing a treatment plan.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
                <button
                  type="button"
                  onClick={() => setStep((s) => s - 1)}
                  disabled={step === 0}
                  className="text-sm font-medium text-muted hover:text-dark disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Back
                </button>
                {step < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep((s) => s + 1)}
                    disabled={!canProceed()}
                    className="rounded-md bg-navy px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-teal disabled:opacity-50"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSubmit()}
                    disabled={loading || !canProceed()}
                    className="rounded-md bg-navy px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-teal disabled:opacity-50"
                  >
                    {loading ? "Submitting..." : "Submit case for review"}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function Input({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
  minLength,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
  minLength?: number;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-dark">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        minLength={minLength}
        className="mt-2 w-full rounded-md border border-border bg-warm-white px-4 py-2.5 text-sm text-dark outline-none transition-colors focus:border-teal focus:ring-1 focus:ring-teal"
        placeholder={placeholder}
      />
    </div>
  );
}

function ReviewRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div className={`flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-start sm:gap-6 ${last ? "" : ""}`}>
      <span className="w-40 shrink-0 text-xs font-medium uppercase tracking-wide text-muted">{label}</span>
      <span className="text-sm text-dark">{value}</span>
    </div>
  );
}

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-teal">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
