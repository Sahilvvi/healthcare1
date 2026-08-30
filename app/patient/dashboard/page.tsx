import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import { StatCard } from "@/app/components/dashboard/StatCard";
import { SectionHeader } from "@/app/components/dashboard/SectionHeader";
import { ActivityFeed } from "@/app/components/dashboard/ActivityFeed";
import { Badge } from "@/app/components/dashboard/Badge";
import { buildActivityFeed } from "@/app/lib/activity";
import type {
  Case,
  CaseTimeline,
  Appointment,
  Document,
  MedicineOrder,
  Prescription,
  SupportTicket,
  Transaction,
} from "@/app/lib/types";
import { Plus, Calendar, Upload, MessageSquare } from "lucide-react";

const journeySteps = [
  { key: "NEW", label: "Medical Review" },
  { key: "MEDICAL_REVIEW", label: "Medical Review" },
  { key: "CONSULTATION", label: "Consultation" },
  { key: "PLAN", label: "Treatment Plan" },
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
  return new Date(ts).toLocaleString("en-IN", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatCurrency(amount: number, currency: string) {
  return `${currency} ${amount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

export default async function PatientDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("dv_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const casesResult = await supabase
    .from("dv_cases")
    .select("*")
    .eq("patient_id", user.id)
    .order("created_at", { ascending: false });
  const cases: Case[] = casesResult.data || [];
  const caseIds = cases.map((c) => c.id);

  const [
    appointmentsResult,
    documentsResult,
    ordersResult,
    prescriptionsResult,
    ticketsResult,
    transactionsResult,
    timelineResult,
    messagesResult,
  ] = await Promise.all([
    caseIds.length
      ? supabase
          .from("dv_appointments")
          .select("*, dv_doctors(name, specialty)")
          .in("case_id", caseIds)
          .order("scheduled_at", { ascending: true })
      : Promise.resolve({ data: [] }),
    supabase.from("dv_documents").select("*").eq("patient_id", user.id).order("created_at", { ascending: false }),
    supabase.from("dv_medicine_orders").select("*").eq("patient_id", user.id).order("created_at", { ascending: false }),
    supabase.from("dv_prescriptions").select("*").eq("patient_id", user.id).order("created_at", { ascending: false }),
    supabase.from("dv_support_tickets").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
    supabase.from("dv_transactions").select("*").eq("patient_id", user.id).order("created_at", { ascending: false }),
    caseIds.length
      ? supabase.from("dv_case_timeline").select("*").in("case_id", caseIds).order("created_at", { ascending: false })
      : Promise.resolve({ data: [] }),
    caseIds.length
      ? supabase.from("dv_messages").select("*").in("case_id", caseIds).order("created_at", { ascending: false }).limit(1)
      : Promise.resolve({ data: [] }),
  ]);

  const activeCase = cases[0];
  const appointments: Appointment[] = appointmentsResult.data || [];
  const documents: Document[] = documentsResult.data || [];
  const orders: MedicineOrder[] = ordersResult.data || [];
  const prescriptions: Prescription[] = (prescriptionsResult.data || []) as Prescription[];
  const tickets: SupportTicket[] = ticketsResult.data || [];
  const transactions: Transaction[] = (transactionsResult.data || []) as Transaction[];
  const timelines: CaseTimeline[] = timelineResult.data || [];
  const messages = messagesResult.data || [];

  const totalPaid = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const openTickets = tickets.filter((t) => t.status === "OPEN").length;
  const upcoming = appointments.find((a) => a.scheduled_at && new Date(a.scheduled_at) >= new Date()) || null;
  const journey = getJourneyStatus(activeCase?.status);
  const currentStepIndex = journey.findIndex((s) => s.status === "current");
  const progress = ((currentStepIndex + 1) / journey.length) * 100;

  const activity = buildActivityFeed({
    cases,
    appointments,
    orders,
    timelines,
    tickets,
    transactions,
    routes: {
      case: "/patient/care-plan",
      timeline: "/patient/care-plan",
      appointment: "/patient/appointments",
      order: "/patient/medicines",
      ticket: "/patient/support",
      transaction: "/patient/billing",
    },
  });

  return (
    <div className="space-y-8">
      <SectionHeader
        title={`Welcome back, ${profile?.name || "Patient"}`}
        subtitle="Your personalized medical-travel dashboard"
      />

      {!activeCase ? (
        <div className="rounded-xl border border-border bg-white p-8 text-center shadow-sm">
          <h2 className="font-heading text-xl font-semibold text-navy">No active case yet</h2>
          <p className="mx-auto mt-2 max-w-lg text-muted">
            Share your medical details so we can prepare a personalized treatment plan and cost estimate.
          </p>
          <Link
            href="/patient/case"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-navy px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal"
          >
            <Plus className="h-4 w-4" />
            Start your case
          </Link>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Active cases" value={cases.length} change={cases.length > 1 ? `${cases.length - 1} previous` : undefined} href="/patient/care-plan" />
            <StatCard label="Upcoming appointments" value={appointments.filter((a) => a.scheduled_at && new Date(a.scheduled_at) >= new Date()).length} href="/patient/appointments" />
            <StatCard label="Documents" value={documents.length} href="/patient/medical-records" />
            <StatCard label="Prescriptions" value={prescriptions.length} href="/patient/prescriptions" />
            <StatCard label="Open support tickets" value={openTickets} href="/patient/support" />
            <StatCard label="Total paid" value={formatCurrency(totalPaid, "USD")} href="/patient/billing" />
            <StatCard label="Medicine orders" value={orders.length} href="/patient/medicines" />
            <StatCard label="Messages" value={messages.length} href="/patient/messages" />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-xl border border-border bg-white p-6 shadow-sm lg:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-heading text-lg font-semibold text-navy">Your Care Journey</h2>
                <Badge tone={activeCase.status === "RECOVERY" ? "success" : "info"}>{activeCase.status}</Badge>
              </div>
              <p className="text-sm text-muted">{activeCase.category}</p>

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
                <div className="h-full bg-navy transition-all" style={{ width: `${progress}%` }} />
              </div>

              {timelines.length > 0 && (
                <div className="mt-6 border-t border-border pt-4">
                  <h3 className="text-sm font-medium text-dark">Latest update</h3>
                  <p className="mt-1 text-sm text-muted">
                    {timelines[0].stage} — {timelines[0].note}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
                <h2 className="font-heading text-lg font-semibold text-navy">Quick actions</h2>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Link href="/patient/case" className="flex items-center gap-2 rounded-lg border border-border bg-warm-white px-3 py-2.5 text-sm font-medium text-dark transition-colors hover:border-navy">
                    <Plus className="h-4 w-4 text-teal" /> New case
                  </Link>
                  <Link href="/doctors" className="flex items-center gap-2 rounded-lg border border-border bg-warm-white px-3 py-2.5 text-sm font-medium text-dark transition-colors hover:border-navy">
                    <Calendar className="h-4 w-4 text-teal" /> Book
                  </Link>
                  <Link href="/patient/medical-records" className="flex items-center gap-2 rounded-lg border border-border bg-warm-white px-3 py-2.5 text-sm font-medium text-dark transition-colors hover:border-navy">
                    <Upload className="h-4 w-4 text-teal" /> Upload
                  </Link>
                  <Link href="/patient/messages" className="flex items-center gap-2 rounded-lg border border-border bg-warm-white px-3 py-2.5 text-sm font-medium text-dark transition-colors hover:border-navy">
                    <MessageSquare className="h-4 w-4 text-teal" /> Chat
                  </Link>
                </div>
              </div>

              {upcoming ? (
                <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
                  <h2 className="font-heading text-lg font-semibold text-navy">Upcoming consultation</h2>
                  <div className="mt-4 rounded-lg bg-sage/30 p-4">
                    <p className="text-sm font-medium text-navy">{upcoming.type}</p>
                    <p className="mt-1 text-sm text-muted">
                      {upcoming.dv_doctors?.name} · {upcoming.dv_doctors?.specialty}
                    </p>
                    <p className="mt-1 text-sm text-muted">{formatTime(upcoming.scheduled_at)}</p>
                    {upcoming.link && (
                      <a
                        href={upcoming.link}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-block text-sm font-medium text-teal hover:text-navy"
                      >
                        Join consultation →
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
                  <h2 className="font-heading text-lg font-semibold text-navy">Next step</h2>
                  <p className="mt-2 text-sm text-muted">Book a consultation to continue your care journey.</p>
                  <Link href="/doctors" className="mt-3 inline-block text-sm font-medium text-teal hover:text-navy">
                    Find a doctor →
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
              <h2 className="font-heading text-lg font-semibold text-navy">Latest prescriptions</h2>
              {prescriptions.length > 0 ? (
                <ul className="mt-4 space-y-3">
                  {prescriptions.slice(0, 3).map((rx) => (
                    <li key={rx.id} className="text-sm text-dark">
                      <span className="font-medium">{rx.medications?.[0]?.name || "Prescription"}</span>
                      <span className="text-muted"> · {rx.status}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm text-muted">No prescriptions yet.</p>
              )}
              <Link href="/patient/prescriptions" className="mt-4 inline-block text-sm font-medium text-teal hover:text-navy">
                View all →
              </Link>
            </div>

            <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
              <h2 className="font-heading text-lg font-semibold text-navy">Billing snapshot</h2>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Total paid</span>
                  <span className="font-medium text-navy">{formatCurrency(totalPaid, "USD")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Transactions</span>
                  <span className="font-medium text-navy">{transactions.length}</span>
                </div>
              </div>
              <Link href="/patient/billing" className="mt-4 inline-block text-sm font-medium text-teal hover:text-navy">
                Manage billing →
              </Link>
            </div>

            <ActivityFeed items={activity} title="Recent activity" />
          </div>
        </>
      )}
    </div>
  );
}
