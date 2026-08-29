import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import { SignOutButton } from "@/app/components/SignOutButton";
import type {
  Case,
  CaseTimeline,
  Appointment,
  Document,
  MedicineOrder,
  TravelItinerary,
  Message,
  Profile,
} from "@/app/lib/types";

const journeySteps = [
  { key: "NEW", label: "Medical Review" },
  { key: "CONSULTATION", label: "Consultation" },
  { key: "TREATMENT_PLAN", label: "Treatment Plan" },
  { key: "TRAVEL", label: "Travel" },
  { key: "TREATMENT", label: "Treatment" },
  { key: "RECOVERY", label: "Recovery" },
];

function getJourneyStatus(status?: string | null) {
  const normalized = (status || "NEW").toUpperCase();
  const currentIndex = journeySteps.findIndex((s) => s.key === normalized);
  const safeIndex = currentIndex === -1 ? 0 : currentIndex;
  return journeySteps.map((step, i) => ({
    ...step,
    status: i < safeIndex ? "completed" : i === safeIndex ? "current" : "pending",
  }));
}

function formatTime(ts?: string | null) {
  if (!ts) return null;
  const date = new Date(ts);
  return date.toLocaleString("en-IN", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function PatientDashboard() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const profileResult = await supabase
    .from("dv_profiles")
    .select("*")
    .eq("id", user.id)
    .single();
  const profile: Profile | null = profileResult.data;

  const casesResult = await supabase
    .from("dv_cases")
    .select("*")
    .eq("patient_id", user.id)
    .order("created_at", { ascending: false });
  const cases: Case[] = casesResult.data || [];
  const activeCase = cases[0];

  const [timelineResult, appointmentsResult, documentsResult, ordersResult, itineraryResult, messagesResult] =
    await Promise.all([
      activeCase
        ? supabase
            .from("dv_case_timeline")
            .select("*")
            .eq("case_id", activeCase.id)
            .order("created_at", { ascending: true })
        : Promise.resolve({ data: [] }),
      activeCase
        ? supabase
            .from("dv_appointments")
            .select("*, dv_doctors(name, specialty)")
            .eq("case_id", activeCase.id)
            .gte("scheduled_at", new Date().toISOString())
            .order("scheduled_at", { ascending: true })
            .limit(1)
        : Promise.resolve({ data: [] }),
      activeCase
        ? supabase
            .from("dv_documents")
            .select("*")
            .eq("case_id", activeCase.id)
            .order("created_at", { ascending: false })
            .limit(4)
        : Promise.resolve({ data: [] }),
      supabase
        .from("dv_medicine_orders")
        .select("*")
        .eq("patient_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single(),
      activeCase
        ? supabase
            .from("dv_travel_itineraries")
            .select("*")
            .eq("case_id", activeCase.id)
            .single()
        : Promise.resolve({ data: null }),
      activeCase
        ? supabase
            .from("dv_messages")
            .select("*")
            .eq("case_id", activeCase.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .single()
        : Promise.resolve({ data: null }),
    ]);

  const timeline: CaseTimeline[] = (timelineResult.data as CaseTimeline[]) || [];
  const appointments: Appointment[] = (appointmentsResult.data as Appointment[]) || [];
  const documents: Document[] = (documentsResult.data as Document[]) || [];
  const order: MedicineOrder | null = (ordersResult.data as MedicineOrder | null) || null;
  const itinerary: TravelItinerary | null = (itineraryResult.data as TravelItinerary | null) || null;
  const message: Message | null = (messagesResult.data as Message | null) || null;

  const journey = getJourneyStatus(activeCase?.status);
  const currentStepIndex = journey.findIndex((s) => s.status === "current");
  const progress = ((currentStepIndex + 1) / journey.length) * 100;

  const appointment = appointments[0];

  return (
    <section className="bg-warm-white py-10 lg:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="font-heading text-3xl font-semibold text-navy md:text-4xl">
              Welcome back, {profile?.name || "Patient"}
            </h1>
            <p className="mt-2 text-muted">
              Your care coordinator is available for any questions.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/patient/case"
              className="rounded-md border border-border bg-white px-4 py-2 text-sm font-medium text-dark transition-colors hover:border-navy"
            >
              New case
            </Link>
            <SignOutButton className="rounded-md bg-navy px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal" />
          </div>
        </div>

        {!activeCase ? (
          <div className="rounded-lg border border-border bg-white p-8 shadow-sm">
            <h2 className="font-heading text-xl font-semibold text-navy">No active case yet</h2>
            <p className="mt-2 text-muted">
              Share your medical details so we can prepare a personalized treatment plan.
            </p>
            <Link
              href="/patient/case"
              className="mt-4 inline-block rounded-md bg-navy px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal"
            >
              Start your case
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-lg border border-border bg-white p-6 shadow-sm lg:col-span-2">
              <h2 className="font-heading text-lg font-semibold text-navy">
                Your Care Journey
              </h2>
              <p className="mt-1 text-sm text-muted">{activeCase.category}</p>
              <div className="mt-6 flex justify-between">
                {journey.map((step, i) => (
                  <div key={step.key} className="flex flex-1 flex-col items-center text-center">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${
                        step.status === "completed"
                          ? "bg-teal text-white"
                          : step.status === "current"
                          ? "border-2 border-navy bg-white text-navy"
                          : "bg-sage text-muted"
                      }`}
                    >
                      {step.status === "completed" ? "✓" : i + 1}
                    </div>
                    <p className="mt-3 hidden text-xs text-dark md:block">{step.label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 h-2 overflow-hidden rounded-full bg-sage">
                <div
                  className="h-full bg-navy transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              {timeline.length > 0 && (
                <div className="mt-6 border-t border-border pt-4">
                  <h3 className="text-sm font-medium text-dark">Latest update</h3>
                  <p className="mt-1 text-sm text-muted">
                    {timeline[timeline.length - 1].stage} — {timeline[timeline.length - 1].note}
                  </p>
                </div>
              )}
            </div>

            <div className="rounded-lg border border-border bg-white p-6 shadow-sm">
              <h2 className="font-heading text-lg font-semibold text-navy">Upcoming</h2>
              {appointment ? (
                <div className="mt-4 rounded-md bg-sage/30 p-4">
                  <p className="text-sm font-medium text-navy">{appointment.type}</p>
                  <p className="mt-1 text-sm text-muted">
                    {appointment.dv_doctors?.name} · {appointment.dv_doctors?.specialty}
                  </p>
                  <p className="mt-1 text-sm text-muted">{formatTime(appointment.scheduled_at)}</p>
                </div>
              ) : (
                <p className="mt-4 text-sm text-muted">No upcoming consultations.</p>
              )}
              <Link
                href="/patient/consultation"
                className="mt-4 inline-block text-sm font-medium text-teal hover:text-navy"
              >
                Join Consultation →
              </Link>
            </div>

            <div className="rounded-lg border border-border bg-white p-6 shadow-sm">
              <h2 className="font-heading text-lg font-semibold text-navy">
                Your Documents
              </h2>
              {documents.length > 0 ? (
                <ul className="mt-4 space-y-3">
                  {documents.map((doc) => (
                    <li
                      key={doc.id}
                      className="flex items-center justify-between text-sm text-dark"
                    >
                      <span>{doc.label}</span>
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-teal hover:text-navy"
                      >
                        View
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm text-muted">No documents uploaded yet.</p>
              )}
            </div>

            <div className="rounded-lg border border-border bg-white p-6 shadow-sm">
              <h2 className="font-heading text-lg font-semibold text-navy">Medicines</h2>
              {order ? (
                <>
                  <p className="mt-2 text-sm text-muted">Order #{order.id.slice(0, 6)}</p>
                  <p className="mt-1 text-sm font-medium text-teal">{order.status}</p>
                </>
              ) : (
                <p className="mt-2 text-sm text-muted">No medicine orders yet.</p>
              )}
              <Link
                href="/patient/medicines"
                className="mt-4 inline-block text-sm font-medium text-teal hover:text-navy"
              >
                Track order →
              </Link>
            </div>

            <Link
              href="/patient/travel"
              className="rounded-lg border border-border bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <h2 className="font-heading text-lg font-semibold text-navy">
                Travel Details
              </h2>
              {itinerary ? (
                <>
                  <p className="mt-2 text-sm text-muted">Coordinator: {itinerary.coordinator_contact || "TBD"}</p>
                  <p className="mt-1 text-sm text-muted">Accommodation: {itinerary.accommodation || "TBD"}</p>
                </>
              ) : (
                <p className="mt-2 text-sm text-muted">Itinerary will appear once travel is arranged.</p>
              )}
            </Link>

            <div className="rounded-lg border border-border bg-white p-6 shadow-sm">
              <h2 className="font-heading text-lg font-semibold text-navy">
                Messages
              </h2>
              {message ? (
                <>
                  <p className="mt-2 text-sm text-muted">Care Coordinator</p>
                  <p className="mt-1 text-sm text-dark">&ldquo;{message.content}&rdquo;</p>
                </>
              ) : (
                <p className="mt-2 text-sm text-muted">No messages yet.</p>
              )}
              <Link href="/patient/messages" className="mt-4 inline-block text-sm font-medium text-teal hover:text-navy">
                Open chat →
              </Link>
            </div>

            <Link
              href="/patient/case"
              className="rounded-lg border border-border bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <h2 className="font-heading text-lg font-semibold text-navy">
                Share your case
              </h2>
              <p className="mt-2 text-sm text-muted">
                Submit symptoms and reports for a medical review and cost estimate.
              </p>
              <span className="mt-4 inline-block text-sm font-medium text-teal hover:text-navy">
                Start submission →
              </span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
