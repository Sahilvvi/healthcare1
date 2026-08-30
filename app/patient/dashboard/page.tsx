import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import { StatCard } from "@/app/components/dashboard/StatCard";
import { SectionHeader } from "@/app/components/dashboard/SectionHeader";
import { ActivityFeed } from "@/app/components/dashboard/ActivityFeed";
import { CareJourney } from "@/app/components/dashboard/CareJourney";
import { Badge } from "@/app/components/dashboard/Badge";
import { Reveal } from "@/app/components/Reveal";
import { buildActivityFeed } from "@/app/lib/activity";
import { Plus, Calendar, Upload, MessageSquare, Pill, Plane, Headphones, ChevronRight } from "lucide-react";
import type {
  Case,
  CaseTimeline,
  Appointment,
  Document,
  MedicineOrder,
  Prescription,
  SupportTicket,
  Transaction,
  Doctor,
  Package,
} from "@/app/lib/types";

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

function profileCompleteness(profile: { name?: string | null; phone?: string | null; country?: string | null }) {
  const keys: (keyof typeof profile)[] = ["name", "phone", "country"];
  const filled = keys.filter((k) => profile?.[k]).length;
  return { fields: keys.length, filled, pct: Math.round((filled / keys.length) * 100) };
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
    doctorsResult,
    packagesResult,
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
      ? supabase.from("dv_messages").select("*").in("case_id", caseIds).order("created_at", { ascending: false }).limit(3)
      : Promise.resolve({ data: [] }),
    supabase
      .from("dv_doctors")
      .select("*")
      .ilike("specialty", `%${cases[0]?.category || ""}%`)
      .order("rating", { ascending: false })
      .limit(2),
    supabase
      .from("dv_packages")
      .select("*")
      .ilike("specialty", `%${cases[0]?.category || ""}%`)
      .limit(2),
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
  const recommendedDoctors: Doctor[] = (doctorsResult?.data || []) as Doctor[];
  const recommendedPackages: Package[] = (packagesResult?.data || []) as Package[];

  const totalPaid = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const openTickets = tickets.filter((t) => t.status === "OPEN").length;
  const upcoming = appointments.find((a) => a.scheduled_at && new Date(a.scheduled_at) >= new Date()) || null;

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

  const completeness = profileCompleteness(profile);

  return (
    <div className="space-y-8">
      <SectionHeader
        title={`Welcome back, ${profile?.name || "Patient"}`}
        subtitle="Your personalized medical-travel dashboard"
        showGreeting
      />

      {!activeCase ? (
        <Reveal>
          <div className="rounded-2xl border border-border bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sage">
              <Plus className="h-8 w-8 text-teal" />
            </div>
            <h2 className="mt-5 font-heading text-xl font-semibold text-navy">No active case yet</h2>
            <p className="mx-auto mt-2 max-w-lg text-muted">
              Share your medical details so we can prepare a personalized treatment plan, doctor shortlist and cost estimate.
            </p>
            <Link
              href="/patient/case"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-navy px-7 py-3 text-sm font-medium text-white transition-colors hover:bg-teal"
            >
              <Plus className="h-4 w-4" />
              Start your case
            </Link>
          </div>
        </Reveal>
      ) : (
        <>
          <Reveal delay={100}>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard label="Active cases" value={cases.length} subtext="Current and previous cases" href="/patient/care-plan" />
              <StatCard label="Upcoming" value={appointments.filter((a) => a.scheduled_at && new Date(a.scheduled_at) >= new Date()).length} subtext="Scheduled appointments" href="/patient/appointments" />
              <StatCard label="Documents" value={documents.length} subtext="Reports and files" href="/patient/medical-records" />
              <StatCard label="Prescriptions" value={prescriptions.length} subtext="Active and past" href="/patient/prescriptions" />
              <StatCard label="Open tickets" value={openTickets} subtext="Support requests" href="/patient/support" />
              <StatCard label="Total paid" value={formatCurrency(totalPaid, "USD")} subtext="Payments so far" href="/patient/billing" />
              <StatCard label="Medicine orders" value={orders.length} subtext="In transit and delivered" href="/patient/medicines" />
              <StatCard label="Messages" value={messages.length} subtext="Recent updates" href="/patient/messages" />
            </div>
          </Reveal>

          <div className="grid gap-6 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-8">
              <Reveal delay={150}>
                <CareJourney activeCase={activeCase} timelines={timelines} />
              </Reveal>

              <div className="grid gap-6 md:grid-cols-2">
                <Reveal delay={200}>
                  <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                      <h2 className="font-heading text-lg font-semibold text-navy">Upcoming appointment</h2>
                      <Badge tone={upcoming ? "success" : "default"}>{upcoming ? "Scheduled" : "None"}</Badge>
                    </div>
                    {upcoming ? (
                      <div className="rounded-xl bg-sage/30 p-4">
                        <p className="text-sm font-medium text-navy">{upcoming.type}</p>
                        <p className="mt-1 text-sm text-muted">
                          {upcoming?.dv_doctors?.name} · {upcoming?.dv_doctors?.specialty}
                        </p>
                        <p className="mt-1 text-sm text-teal">{formatTime(upcoming.scheduled_at)}</p>
                        {upcoming.link && (
                          <a
                            href={upcoming.link}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-navy hover:text-teal"
                          >
                            Join consultation <ChevronRight className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-muted">No upcoming appointments. Book a consultation to continue.</p>
                    )}
                    <Link href="/patient/appointments" className="mt-4 inline-block text-sm font-medium text-teal hover:text-navy">
                      View all appointments →
                    </Link>
                  </div>
                </Reveal>

                <Reveal delay={250}>
                  <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                      <h2 className="font-heading text-lg font-semibold text-navy">Quick actions</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <QuickLink href="/patient/case" icon={<Plus className="h-4 w-4" />} label="New case" />
                      <QuickLink href="/doctors" icon={<Calendar className="h-4 w-4" />} label="Book doctor" />
                      <QuickLink href="/patient/medical-records" icon={<Upload className="h-4 w-4" />} label="Upload" />
                      <QuickLink href="/patient/messages" icon={<MessageSquare className="h-4 w-4" />} label="Messages" />
                      <QuickLink href="/patient/travel" icon={<Plane className="h-4 w-4" />} label="Travel" />
                      <QuickLink href="/patient/support" icon={<Headphones className="h-4 w-4" />} label="Support" />
                    </div>
                  </div>
                </Reveal>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Reveal delay={300}>
                  <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                      <h2 className="font-heading text-lg font-semibold text-navy">Latest prescriptions</h2>
                      <Link href="/patient/prescriptions" className="text-xs font-medium text-teal hover:text-navy">View all</Link>
                    </div>
                    {prescriptions.length > 0 ? (
                      <ul className="space-y-3">
                        {prescriptions.slice(0, 3).map((rx) => (
                          <li key={rx.id} className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-2 text-dark">
                              <Pill className="h-4 w-4 text-teal" />
                              {rx.medications?.[0]?.name || "Prescription"}
                            </span>
                            <Badge tone={rx.status === "ACTIVE" ? "success" : "default"}>{rx.status}</Badge>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted">No prescriptions yet.</p>
                    )}
                  </div>
                </Reveal>

                <Reveal delay={350}>
                  <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                      <h2 className="font-heading text-lg font-semibold text-navy">Billing snapshot</h2>
                      <Link href="/patient/billing" className="text-xs font-medium text-teal hover:text-navy">Details</Link>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted">Total paid</span>
                        <span className="font-medium text-navy">{formatCurrency(totalPaid, "USD")}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted">Transactions</span>
                        <span className="font-medium text-navy">{transactions.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted">Open balance</span>
                        <span className="font-medium text-navy">$0.00</span>
                      </div>
                    </div>
                  </div>
                </Reveal>
              </div>

              {(recommendedDoctors.length > 0 || recommendedPackages.length > 0) && (
                <Reveal delay={400}>
                  <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                    <div className="mb-5 flex items-center justify-between">
                      <h2 className="font-heading text-lg font-semibold text-navy">Recommended for you</h2>
                      <span className="text-xs text-muted">Based on your case</span>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {recommendedDoctors.map((doc) => (
                        <Link
                          key={doc.id}
                          href={`/doctors/${doc.slug}`}
                          className="group flex items-center gap-4 rounded-xl border border-border bg-warm-white p-4 transition-all hover:border-teal hover:shadow-sm"
                        >
                          <div className="relative h-14 w-14 overflow-hidden rounded-full bg-sage">
                            <Image src={doc.image} alt={doc.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-navy">{doc.name}</p>
                            <p className="text-xs text-muted">{doc.specialty}</p>
                            <p className="text-xs text-teal">{doc.rating} ★ · {doc.experience}</p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted transition-colors group-hover:text-teal" />
                        </Link>
                      ))}
                      {recommendedPackages.map((pkg) => (
                        <Link
                          key={pkg.id}
                          href={`/packages/${pkg.slug}`}
                          className="group rounded-xl border border-border bg-warm-white p-4 transition-all hover:border-teal hover:shadow-sm"
                        >
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-navy">{pkg.name}</p>
                            <span className="text-sm font-semibold text-teal">{pkg.price}</span>
                          </div>
                          <p className="mt-1 text-xs text-muted">{pkg.stay} stay · {pkg.includes.slice(0, 2).join(", ")}…</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                </Reveal>
              )}
            </div>

            <div className="space-y-6 lg:col-span-4">
              <Reveal delay={200}>
                <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="font-heading text-lg font-semibold text-navy">Profile snapshot</h2>
                    <Link href="/patient/settings" className="text-xs font-medium text-teal hover:text-navy">Edit</Link>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sage text-xl font-semibold text-navy">
                      {(profile?.name || "P").charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-navy">{profile?.name || "Patient"}</p>
                      <p className="text-xs text-muted">{user.email}</p>
                    </div>
                  </div>
                  <div className="mt-5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted">Profile complete</span>
                      <span className="font-medium text-navy">{completeness.pct}%</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-sage">
                      <div className="h-full rounded-full bg-navy transition-all" style={{ width: `${completeness.pct}%` }} />
                    </div>
                    <p className="mt-2 text-xs text-muted">{completeness.filled}/{completeness.fields} fields completed</p>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={300}>
                <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="font-heading text-lg font-semibold text-navy">Need help?</h2>
                  </div>
                  <p className="text-sm text-muted">
                    Your care coordinator is available to answer questions about appointments, travel and billing.
                  </p>
                  <Link
                    href="/patient/support"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-teal hover:text-navy"
                  >
                    <Headphones className="h-4 w-4" /> Open a support ticket
                  </Link>
                </div>
              </Reveal>

              <Reveal delay={400}>
                <ActivityFeed items={activity} title="Recent activity" />
              </Reveal>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function QuickLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 rounded-xl border border-border bg-warm-white px-3 py-2.5 text-sm font-medium text-dark transition-colors hover:border-navy hover:text-navy"
    >
      <span className="text-teal">{icon}</span>
      {label}
    </Link>
  );
}
