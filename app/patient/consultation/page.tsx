import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import { SectionHeader } from "@/app/components/dashboard/SectionHeader";
import { Badge } from "@/app/components/dashboard/Badge";
import { EmptyState } from "@/app/components/dashboard/EmptyState";
import type { Appointment } from "@/app/lib/types";

function formatDateTime(ts: string) {
  return new Date(ts).toLocaleString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" });
}

export default async function PatientConsultationPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: cases } = await supabase.from("dv_cases").select("id").eq("patient_id", user.id);
  const caseIds = (cases || []).map((c) => c.id);

  const { data: appointments } = caseIds.length
    ? await supabase
        .from("dv_appointments")
        .select("*, dv_doctors(name, specialty)")
        .in("case_id", caseIds)
        .order("scheduled_at", { ascending: false })
    : { data: [] };

  const list: Appointment[] = (appointments || []) as Appointment[];
  const now = new Date().toISOString();
  const upcoming = list.filter((a) => a.scheduled_at && a.scheduled_at >= now);
  const past = list.filter((a) => a.scheduled_at && a.scheduled_at < now);
  const next = upcoming[0] || null;

  return (
    <div className="space-y-8">
      <SectionHeader title="Consultations" subtitle="Your upcoming video calls and appointment history" />

      {next ? (
        <div className="rounded-xl border border-border bg-white p-6 shadow-sm lg:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="font-heading text-xl font-semibold text-navy">Upcoming consultation</h2>
              <p className="mt-1 text-muted">{next.dv_doctors?.name} · {next.dv_doctors?.specialty}</p>
              <p className="mt-2 text-lg font-medium text-dark">{next.scheduled_at ? formatDateTime(next.scheduled_at) : "Time TBC"}</p>
              <Badge tone="info" className="mt-3">{next.type}</Badge>
            </div>
            {next.link && (next.status === "SCHEDULED" || next.status === "CONFIRMED") ? (
              <a
                href={next.link}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md bg-navy px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-teal"
              >
                Join call
              </a>
            ) : (
              <p className="text-sm text-muted">The call link will appear here shortly.</p>
            )}
          </div>

          <div className="mt-6 grid gap-4 border-t border-border pt-6 sm:grid-cols-3">
            <div>
              <p className="text-xs font-medium uppercase text-muted">Before the call</p>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-dark">
                <li>Keep your reports and ID nearby.</li>
                <li>Test your camera and microphone.</li>
                <li>Join from a quiet, well-lit space.</li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-muted">During the call</p>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-dark">
                <li>Speak clearly about symptoms and concerns.</li>
                <li>Ask questions about treatment options.</li>
                <li>Note any recommendations.</li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-muted">After the call</p>
              <p className="mt-2 text-sm text-dark">The doctor will add notes and prescriptions to your care plan. You can message the team anytime.</p>
            </div>
          </div>
        </div>
      ) : (
        <EmptyState
          title="No upcoming consultations"
          subtitle="Book a consultation with a specialist to start your treatment planning."
        >
          <Link href="/doctors" className="mt-4 inline-block rounded-md bg-navy px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal">
            Find a doctor
          </Link>
        </EmptyState>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
          <h2 className="font-heading text-lg font-semibold text-navy">Scheduled calls</h2>
          {upcoming.length === 0 ? (
            <p className="mt-4 text-sm text-muted">No upcoming calls.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {upcoming.map((a) => (
                <li key={a.id} className="flex items-center justify-between rounded-lg bg-warm-white px-4 py-3">
                  <div className="text-sm">
                    <p className="font-medium text-dark">{a.dv_doctors?.name} · {a.dv_doctors?.specialty}</p>
                    <p className="text-muted">{a.scheduled_at ? formatDateTime(a.scheduled_at) : "TBC"}</p>
                  </div>
                  {a.link && <a href={a.link} target="_blank" rel="noreferrer" className="text-sm font-medium text-teal hover:text-navy">Join</a>}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
          <h2 className="font-heading text-lg font-semibold text-navy">Past consultations</h2>
          {past.length === 0 ? (
            <p className="mt-4 text-sm text-muted">No past consultations.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {past.map((a) => (
                <li key={a.id} className="rounded-lg bg-warm-white px-4 py-3 text-sm">
                  <p className="font-medium text-dark">{a.dv_doctors?.name} · {a.dv_doctors?.specialty}</p>
                  <p className="text-muted">{a.scheduled_at ? formatDateTime(a.scheduled_at) : "TBC"} · <Badge tone={a.status === "COMPLETED" ? "success" : "default"}>{a.status}</Badge></p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
