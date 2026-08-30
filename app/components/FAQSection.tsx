"use client";

import { useState } from "react";

const faqs = [
  {
    question: "How quickly can I receive a treatment plan?",
    answer:
      "Most patients receive an initial medical review and treatment plan within 24 hours of submitting their case and reports.",
  },
  {
    question: "Are the packages all-inclusive?",
    answer:
      "Each package lists what is included — specialist consultation, procedure, hospital stay, follow-up and care coordination. Exclusions are also clearly stated.",
  },
  {
    question: "Will I get help with visa and travel?",
    answer:
      "Yes. Your care coordinator assists with medical visa letters, airport transfers, accommodation options and local logistics.",
  },
  {
    question: "Can I choose my doctor?",
    answer:
      "After reviewing your case, we recommend the most suitable specialists and hospitals. You can review their profiles before confirming.",
  },
  {
    question: "What happens after I return home?",
    answer:
      "You continue to receive follow-up consultations, prescriptions, medicine delivery support and messaging with your care team.",
  },
];

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="bg-warm-white py-20 lg:py-28">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-teal">Questions & answers</p>
          <h2 className="mt-3 font-heading text-3xl font-semibold text-navy md:text-4xl">
            Common questions from international patients
          </h2>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-lg border border-border bg-white p-5 shadow-sm">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between text-left"
              >
                <span className="font-heading font-semibold text-navy">{faq.question}</span>
                <span className="ml-4 text-teal">{open === i ? "−" : "+"}</span>
              </button>
              {open === i && (
                <p className="mt-3 text-sm leading-relaxed text-muted">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
