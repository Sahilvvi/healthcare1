import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import { supabaseAdmin } from "@/app/lib/supabase/admin";
import type { Appointment } from "@/app/lib/types";

interface FollowUpAppointment extends Appointment {
  dv_cases?: { dv_profiles?: { name: string } | null } | null;
  dv_doctors?: { name: string; specialty: string } | null;
}

export default async function DoctorFollowUpsPage() {
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
    .ilike("type", "%follow%")
    .order("scheduled_at", { ascending: true })
    .limit(50);

  const followUps: FollowUpAppointment[] = (appointmentsData as FollowUpAppointment[]) || [];

  return (
    <section className="bg-warm-white py-10 lg:py-16">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-3xl font-semibold text-navy md:text-4xl">Follow-ups</h1>
            <p className="mt-2 text-muted">Scheduled patient follow-ups and reminders.</p>
          </div>
          <Link href="/doctor/dashboard" className="text-sm font-medium text-teal hover:text-navy">
            Back to dashboard
          </Link>
        </div>

        <div className="space-y-4">
          {followUps.map((f) => (
            <div key={f.id} className="rounded-lg border border-border bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="font-medium text-dark">{f.dv_cases?.dv_profiles?.name || "Patient"}</p>
                <span className="text-xs text-muted">
                  Due {f.scheduled_at ? new Date(f.scheduled_at).toLocaleDateString() : "TBC"}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted">{f.dv_doctors?.name || "Doctor"} · {f.type}</p>
            </div>
          ))}
          {followUps.length === 0 && (
            <p className="text-sm text-muted">No follow-ups scheduled.</p>
          )}
        </div>
      </div>
    </section>
  );
}
