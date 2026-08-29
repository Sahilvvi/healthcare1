import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import { supabaseAdmin } from "@/app/lib/supabase/admin";
import { SignOutButton } from "@/app/components/SignOutButton";
import type { Appointment, Case } from "@/app/lib/types";

export default async function DoctorDashboard() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("dv_profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if ((profile as { role?: string } | null)?.role !== "doctor" && (profile as { role?: string } | null)?.role !== "admin") {
    redirect("/patient/dashboard");
  }

  const today = new Date().toISOString().slice(0, 10);

  const [{ data: appointments }, { data: cases }] = await Promise.all([
    supabaseAdmin
      .from("dv_appointments")
      .select("*, dv_doctors(name, specialty), dv_cases(patient_id)")
      .order("scheduled_at", { ascending: true })
      .limit(20),
    supabaseAdmin
      .from("dv_cases")
      .select("*, dv_profiles(name, country)")
      .eq("status", "NEW")
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  const appointmentList: (Appointment & {
    dv_doctors?: { name: string; specialty: string } | null;
  })[] = (appointments as unknown as (Appointment & {
    dv_doctors?: { name: string; specialty: string } | null;
  })[]) || [];

  const pendingCases: (Case & {
    dv_profiles?: { name: string; country: string } | null;
  })[] = (cases as unknown as (Case & {
    dv_profiles?: { name: string; country: string } | null;
  })[]) || [];

  const todayAppointments = appointmentList.filter((a) =>
    a.scheduled_at ? a.scheduled_at.startsWith(today) : false
  );

  return (
    <section className="bg-warm-white py-10 lg:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-3xl font-semibold text-navy">
              Doctor workspace
            </h1>
            <p className="mt-2 text-muted">Welcome back</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/doctor/patients"
              className="rounded-md bg-navy px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal"
            >
              + New consultation
            </Link>
            <SignOutButton className="rounded-md border border-border bg-white px-4 py-2 text-sm font-medium text-dark transition-colors hover:border-navy" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-border bg-white p-5 shadow-sm">
            <p className="text-sm text-muted">Today&apos;s consultations</p>
            <p className="mt-2 font-heading text-3xl font-semibold text-navy">{todayAppointments.length}</p>
          </div>
          <div className="rounded-lg border border-border bg-white p-5 shadow-sm">
            <p className="text-sm text-muted">Pending cases</p>
            <p className="mt-2 font-heading text-3xl font-semibold text-navy">{pendingCases.length}</p>
          </div>
          <div className="rounded-lg border border-border bg-white p-5 shadow-sm">
            <p className="text-sm text-muted">Total scheduled</p>
            <p className="mt-2 font-heading text-3xl font-semibold text-navy">{appointmentList.length}</p>
          </div>
          <div className="rounded-lg border border-border bg-white p-5 shadow-sm">
            <p className="text-sm text-muted">Follow-ups</p>
            <p className="mt-2 font-heading text-3xl font-semibold text-navy">0</p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-border bg-white p-6 shadow-sm">
            <h2 className="font-heading text-lg font-semibold text-navy">
              Today&apos;s consultations
            </h2>
            <div className="mt-4 divide-y divide-border">
              {todayAppointments.length > 0 ? (
                todayAppointments.map((c) => (
                  <div key={c.id} className="flex items-center justify-between py-4">
                    <div>
                      <p className="font-medium text-dark">{c.dv_doctors?.name || "Doctor"}</p>
                      <p className="text-sm text-muted">
                        {new Date(c.scheduled_at!).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} · {c.type}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        c.status === "COMPLETED"
                          ? "bg-sage text-dark"
                          : "bg-champagne/40 text-navy"
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                ))
              ) : (
                <p className="py-4 text-sm text-muted">No consultations scheduled for today.</p>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-white p-6 shadow-sm">
            <h2 className="font-heading text-lg font-semibold text-navy">Pending cases</h2>
            <div className="mt-4 divide-y divide-border">
              {pendingCases.length > 0 ? (
                pendingCases.map((c) => (
                  <div key={c.id} className="py-4">
                    <p className="font-medium text-dark">{c.dv_profiles?.name || "Patient"}</p>
                    <p className="text-sm text-muted">{c.condition || c.category || "—"}</p>
                    <p className="mt-1 text-xs text-teal">{c.dv_profiles?.country || c.country || "—"}</p>
                  </div>
                ))
              ) : (
                <p className="py-4 text-sm text-muted">No pending cases.</p>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-white p-6 shadow-sm">
            <h2 className="font-heading text-lg font-semibold text-navy">Quick actions</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                { label: "Prescriptions", href: "/doctor/prescriptions" },
                { label: "Case notes", href: "/doctor/case-notes" },
                { label: "Teleconsultations", href: "/doctor/teleconsultations" },
                { label: "Follow-ups", href: "/doctor/follow-ups" },
              ].map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="rounded-md border border-border p-4 text-sm font-medium text-dark transition-colors hover:border-navy hover:text-navy"
                >
                  {action.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-white p-6 shadow-sm">
            <h2 className="font-heading text-lg font-semibold text-navy">Patient timeline</h2>
            <div className="mt-4 space-y-4">
              {["New → Review", "Review → Consultation", "Consultation → Plan", "Plan → Treatment"].map(
                (stage, i) => (
                  <div key={stage} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-navy text-xs text-white">
                      {i + 1}
                    </div>
                    <p className="text-sm text-dark">{stage}</p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
