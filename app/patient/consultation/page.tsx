import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import type { Appointment } from "@/app/lib/types";

export default async function ConsultationPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const { data: cases } = await supabase
    .from("dv_cases")
    .select("id")
    .eq("patient_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1);

  const activeCase = cases?.[0];

  let upcoming: (Appointment & {
    dv_doctors?: { name: string; specialty: string } | null;
  }) | null = null;

  if (activeCase) {
    const { data } = await supabase
      .from("dv_appointments")
      .select("*, dv_doctors(name, specialty)")
      .eq("case_id", activeCase.id)
      .gte("scheduled_at", new Date().toISOString())
      .order("scheduled_at", { ascending: true })
      .limit(1)
      .single();
    upcoming = (data as (Appointment & { dv_doctors?: { name: string; specialty: string } | null })) || null;
  }

  return (
    <section className="bg-warm-white py-10 lg:py-16">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-heading text-2xl font-semibold text-navy md:text-3xl">
            Video Consultation
          </h1>
          <Link
            href="/patient/dashboard"
            className="text-sm font-medium text-teal hover:text-navy"
          >
            Back to dashboard
          </Link>
        </div>

        <div className="aspect-video rounded-lg border border-border bg-navy/5 p-8 text-center shadow-sm">
          {upcoming ? (
            <>
              <p className="font-heading text-xl font-semibold text-navy">
                {upcoming.dv_doctors?.name || "Doctor"} · {upcoming.dv_doctors?.specialty || ""}
              </p>
              <p className="mt-2 text-muted">
                {upcoming.scheduled_at
                  ? new Date(upcoming.scheduled_at).toLocaleString(undefined, {
                      weekday: "long",
                      hour: "numeric",
                      minute: "2-digit",
                    })
                  : "Time TBC"}
              </p>
              <p className="mt-6 text-sm text-muted">
                The consultation room will open 15 minutes before your scheduled time.
              </p>
              <a
                href={upcoming.link || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-6 inline-block rounded-md bg-navy px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-teal ${
                  upcoming.status !== "SCHEDULED" ? "pointer-events-none opacity-60" : ""
                }`}
              >
                Join call
              </a>
            </>
          ) : (
            <>
              <p className="font-heading text-xl font-semibold text-navy">No upcoming consultations</p>
              <p className="mt-2 text-muted">Book a consultation from your dashboard.</p>
              <Link
                href="/doctors"
                className="mt-6 inline-block rounded-md bg-navy px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-teal"
              >
                Find a doctor
              </Link>
            </>
          )}
        </div>

        <div className="mt-6 rounded-lg border border-border bg-white p-6 shadow-sm">
          <h2 className="font-heading text-lg font-semibold text-navy">Before the call</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted">
            <li>Keep your reports and ID nearby.</li>
            <li>Test your camera and microphone.</li>
            <li>Join from a quiet, well-lit space.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
