"use client";

import { useEffect, useRef, useState } from "react";
import { Reveal } from "./Reveal";
import { FileText, UserSearch, ClipboardList, Plane, Stethoscope, HeartPulse } from "lucide-react";

const steps = [
  { number: "01", title: "Medical Evaluation", description: "Share your reports and symptoms for a confidential medical review.", icon: FileText },
  { number: "02", title: "Doctor & Hospital Match", description: "Get matched with verified specialists and accredited hospitals.", icon: UserSearch },
  { number: "03", title: "Treatment Plan", description: "Review a tailored plan with costs, timeline and inclusions.", icon: ClipboardList },
  { number: "04", title: "Visa & Travel", description: "Receive visa, accommodation and airport-transfer support.", icon: Plane },
  { number: "05", title: "Treatment in India", description: "Your care coordinator accompanies you through every hospital visit.", icon: Stethoscope },
  { number: "06", title: "Recovery & Follow-up", description: "Continue recovery with digital follow-ups and prescriptions.", icon: HeartPulse },
];

export function Journey() {
  const ref = useRef<SVGSVGElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.2 });
    observer.observe(svg);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="journey" className="relative overflow-hidden bg-sage/30 py-24 lg:py-32">
      <div className="absolute inset-0 bg-dot-pattern opacity-20" />
      <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
        <Reveal>
          <div className="mb-16 max-w-2xl text-center lg:mx-auto">
            <p className="text-sm font-semibold uppercase tracking-widest text-teal">Plan → Treat → Recover</p>
            <h2 className="mt-3 font-heading text-4xl font-semibold text-navy md:text-5xl">
              Your healthcare journey, taken care of.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted">
              A clear path from first contact to recovery, supported by a dedicated care team at every step.
            </p>
          </div>
        </Reveal>

        <div className="relative">
          <svg
            ref={ref}
            className="absolute left-8 top-0 hidden h-full w-1 lg:left-1/2 lg:block lg:-translate-x-1/2"
            preserveAspectRatio="none"
          >
            <line
              x1="50%"
              y1="0"
              x2="50%"
              y2="100%"
              stroke="#0F766E"
              strokeWidth="2"

              className="line-draw"
              data-visible={visible}
            />
          </svg>

          <div className="space-y-12 lg:space-y-0">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const isLeft = i % 2 === 0;
              return (
                <div key={step.number} className="relative lg:grid lg:grid-cols-2 lg:gap-16">
                  <Reveal delay={i * 120} className={isLeft ? "lg:pr-16" : "lg:col-start-2 lg:pl-16"}>
                    <div className={`relative rounded-2xl border border-border bg-white p-6 shadow-sm card-hover lg:p-8 ${isLeft ? "lg:text-right" : ""}`}>
                      <div className={`flex items-center gap-4 mb-4 ${isLeft ? "lg:flex-row-reverse" : ""}`}>
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-navy text-white transition-transform duration-300 hover:scale-110">
                          <Icon className="h-6 w-6" />
                        </div>
                        <span className="font-heading text-2xl font-semibold text-navy/10">{step.number}</span>
                      </div>
                      <h3 className="font-heading text-xl font-semibold text-navy">{step.title}</h3>
                      <p className="mt-2 max-w-md text-muted">{step.description}</p>
                    </div>
                  </Reveal>

                  <div className="absolute left-8 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 -translate-x-1/2 items-center justify-center rounded-full border-4 border-sage bg-teal text-sm font-semibold text-white lg:left-1/2 lg:flex">
                    {i + 1}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
