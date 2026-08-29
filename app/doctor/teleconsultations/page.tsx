import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import { supabaseAdmin } from "@/app/lib/supabase/admin";
import type { Appointment } from "@/app/lib/types";

interface AppointmentWithPatient extends Appointment {
  dv_cases?: { dv_profiles?: { name: string } | null } | null;
  dv_doctors?: { name: string; specialty: string } | null;
}

export default async function DoctorTeleconsultationsPage() {
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

  const role = (profile as { role?: string } | null)?.role;
  if (role !== "doctor" && role !== "admin") {
    redirect("/patient/dashboard");
  }

  const { data: appointmentsData } = await supabaseAdmin
    .from("dv_appointments")
    .select("*, dv_cases!inner(dv_profiles(name)), dv_doctors(name, specialty)")
    .order("scheduled_at", { ascending: true })
    .limit(50);

  const appointments: AppointmentWithPatient[] = (appointmentsData as AppointmentWithPatient[]) || [];

  return (
    <section className="bg-warm-white py-10 lg:py-16">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-3xl font-semibold text-navy md:text-4xl">Teleconsultations</h1>
            <p className="mt-2 text-muted">Upcoming and completed video calls.</p>
          </div>
          <Link href="/doctor/dashboard" className="text-sm font-medium text-teal hover:text-navy">
            Back to dashboard
          </Link>
        </div>

        <div className="space-y-4">
          {appointments.map((t) => (
            <div key={t.id} className="flex items-center justify-between rounded-lg border border-border bg-white p-5 shadow-sm">
              <div>
                <p className="font-medium text-dark">{t.dv_cases?.dv_profiles?.name || "Patient"}</p>
                <p className="text-sm text-muted">
                  {t.scheduled_at ? new Date(t.scheduled_at).toLocaleString() : "TBC"} · {t.type}
                </p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${t.status === "COMPLETED" ? "bg-sage text-dark" : "bg-champagne/40 text-navy"}`}>
                {t.status}
              </span>
            </div>
          ))}
          {appointments.length === 0 && (
            <p className="text-sm text-muted">No teleconsultations scheduled.</p>
          )}
        </div>
      </div>
    </section>
  );
}
