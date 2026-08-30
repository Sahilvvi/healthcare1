"use client";

import { useState } from "react";
import { Reveal } from "./Reveal";

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
    <section className="bg-warm-white py-20 lg:py-28">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <Reveal>
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-teal">Questions & answers</p>
            <h2 className="mt-3 font-heading text-3xl font-semibold text-navy md:text-4xl">
              Common questions from international patients
            </h2>
          </div>
        </Reveal>
        <div className="space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={i} delay={i * 80}>
                <div className="rounded-2xl border border-border bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="font-heading font-semibold text-navy pr-4">{faq.question}</span>
                    <span className={`ml-4 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sage text-sm font-semibold text-navy transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
                      {isOpen ? "−" : "+"}
                  </span>
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "mt-3 max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
                  >
                    <p className="text-sm leading-relaxed text-muted">{faq.answer}</p>
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
