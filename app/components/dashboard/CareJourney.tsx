"use client";

import { useMemo } from "react";
import { Check } from "lucide-react";
import type { Case, CaseTimeline } from "@/app/lib/types";

const journeySteps = [
  { key: "MEDICAL_REVIEW", label: "Medical Review" },
  { key: "CONSULTATION", label: "Consultation" },
  { key: "PLAN", label: "Treatment Plan" },
  { key: "TRAVEL", label: "Travel" },
  { key: "TREATMENT", label: "Treatment" },
  { key: "RECOVERY", label: "Recovery" },
];

const aliasMap: Record<string, string> = {
  NEW: "MEDICAL_REVIEW",
  PENDING: "MEDICAL_REVIEW",
};

function getJourneyStatus(status?: string | null) {
  const normalized = (status || "MEDICAL_REVIEW").toUpperCase();
  const targetKey = aliasMap[normalized] || normalized;
  const currentIndex = journeySteps.findIndex((s) => s.key === targetKey);
  const safeIndex = currentIndex === -1 ? 0 : currentIndex;
  return journeySteps.map((step, i) => ({
    ...step,
    status: i < safeIndex ? "completed" : i === safeIndex ? "current" : "pending" as const,
  }));
}

function getTimelineDate(timelines: CaseTimeline[], stage: string) {
  const t = timelines.find((x) => x.stage.toUpperCase() === stage);
  return t?.created_at
    ? new Date(t.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
    : null;
}

export function CareJourney({ activeCase, timelines }: { activeCase?: Case | null; timelines: CaseTimeline[] }) {
  const journey = useMemo(() => getJourneyStatus(activeCase?.status), [activeCase?.status]);
  const currentIndex = journey.findIndex((s) => s.status === "current");
  const progress = ((currentIndex + 1) / journey.length) * 100;

  return (
    <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-heading text-lg font-semibold text-navy">Your Care Journey</h2>
          <p className="mt-1 text-sm text-muted">
            {activeCase?.category || "Your case"} · Last updated {getTimelineDate(timelines, activeCase?.status || "MEDICAL_REVIEW") || "today"}
          </p>
        </div>
        <span
          className={`self-start rounded-full px-3 py-1 text-xs font-semibold sm:self-auto ${
            activeCase?.status === "RECOVERY" ? "bg-teal/10 text-teal" : "bg-sage text-navy"
          }`}
        >
          {activeCase?.status || "Medical review"}
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-sage">
        <div className="h-full rounded-full bg-teal transition-all duration-1000" style={{ width: `${progress}%` }} />
      </div>

      <div className="relative mt-10">
        <div className="absolute left-5 top-0 h-full w-0.5 bg-sage md:left-6" />
        {journey.map((step, i) => {
          const date = getTimelineDate(timelines, step.key);
          return (
            <div key={step.key} className="relative mb-8 flex gap-5 last:mb-0">
              <div
                className={`z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold md:h-12 md:w-12 ${
                  step.status === "completed"
                    ? "border-teal bg-teal text-white"
                    : step.status === "current"
                    ? "border-navy bg-white text-navy shadow-sm"
                    : "border-sage bg-warm-white text-muted"
                }`}
              >
                {step.status === "completed" ? <Check className="h-5 w-5" /> : i + 1}
              </div>
              <div className="flex-1 pt-1 md:pt-2">
                <p className={`font-heading text-sm font-semibold md:text-base ${step.status === "pending" ? "text-muted" : "text-navy"}`}>
                  {step.label}
                </p>
                {date && <p className="mt-1 text-xs text-muted">{date}</p>}
                {i === currentIndex && <p className="mt-2 text-xs font-medium text-teal">Current stage</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
