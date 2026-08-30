"use client";

import { useState } from "react";
import { Reveal } from "./Reveal";
import { Plus, Minus } from "lucide-react";

const faqs = [
  { question: "How quickly can I receive a treatment plan?", answer: "Most patients receive an initial medical review and treatment plan within 24 hours of submitting their case and reports." },
  { question: "Are the packages all-inclusive?", answer: "Each package lists what is included — specialist consultation, procedure, hospital stay, follow-up and care coordination. Exclusions are also clearly stated." },
  { question: "Will I get help with visa and travel?", answer: "Yes. Your care coordinator assists with medical visa letters, airport transfers, accommodation options and local logistics." },
  { question: "Can I choose my doctor?", answer: "After reviewing your case, we recommend the most suitable specialists and hospitals. You can review their profiles before confirming." },
  { question: "What happens after I return home?", answer: "You continue to receive follow-up consultations, prescriptions, medicine delivery support and messaging with your care team." },
];

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="relative overflow-hidden bg-warm-white py-24 lg:py-32">
      <div className="absolute inset-0 bg-soft-radial" />
      <div className="relative mx-auto max-w-3xl px-6 lg:px-8">
        <Reveal>
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-teal">Questions & answers</p>
            <h2 className="mt-3 font-heading text-4xl font-semibold text-navy md:text-5xl">
              Common questions from international patients
            </h2>
          </div>
        </Reveal>
        <div className="space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={i} delay={i * 80}>
                <div className={`rounded-2xl border bg-white p-5 shadow-sm transition-all duration-300 ${isOpen ? "border-teal" : "border-border hover:shadow-md"}`}>
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="pr-6 font-heading font-semibold text-navy">{faq.question}</span>
                    <span className={`ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${isOpen ? "bg-teal text-white" : "bg-sage text-navy"}`}>
                      {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </span>
                  </button>
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                  >
                    <div className="overflow-hidden">
                      <p className="pt-4 text-sm leading-relaxed text-muted">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
