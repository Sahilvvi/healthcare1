import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import { supabaseAdmin } from "@/app/lib/supabase/admin";
import { SignOutButton } from "@/app/components/SignOutButton";
import type { Case, Profile } from "@/app/lib/types";

const stages = ["New", "Medical Review", "Consultation", "Plan", "Treatment", "Recovery"];

export default async function AdminDashboard() {
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

  if ((profile as { role?: string } | null)?.role !== "admin") {
    redirect("/patient/dashboard");
  }

  const [
    { count: patientCount },
    { count: activeCaseCount },
    { count: todayConsultCount },
    { count: orderCount },
    { data: cases },
  ] = await Promise.all([
    supabaseAdmin.from("dv_profiles").select("*", { count: "exact", head: true }).eq("role", "patient"),
    supabaseAdmin.from("dv_cases").select("*", { count: "exact", head: true }),
    supabaseAdmin
      .from("dv_appointments")
      .select("*", { count: "exact", head: true })
      .gte("scheduled_at", new Date().toISOString().slice(0, 10) + "T00:00:00")
      .lte("scheduled_at", new Date().toISOString().slice(0, 10) + "T23:59:59"),
    supabaseAdmin.from("dv_medicine_orders").select("*", { count: "exact", head: true }),
    supabaseAdmin
      .from("dv_cases")
      .select("*, dv_profiles(name, country)")
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  const casesList: (Case & { dv_profiles?: Profile | null })[] =
    (cases as (Case & { dv_profiles?: Profile | null })[]) || [];

  return (
    <section className="bg-warm-white py-10 lg:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="font-heading text-3xl font-semibold text-navy">
              Admin dashboard
            </h1>
            <p className="mt-2 text-muted">International patient operations overview</p>
          </div>
          <SignOutButton className="rounded-md border border-border bg-white px-4 py-2 text-sm font-medium text-dark transition-colors hover:border-navy" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-lg border border-border bg-white p-5 shadow-sm">
            <p className="text-sm text-muted">International Patients</p>
            <p className="mt-2 font-heading text-2xl font-semibold text-navy">{patientCount ?? 0}</p>
          </div>
          <div className="rounded-lg border border-border bg-white p-5 shadow-sm">
            <p className="text-sm text-muted">Active Cases</p>
            <p className="mt-2 font-heading text-2xl font-semibold text-navy">{activeCaseCount ?? 0}</p>
          </div>
          <div className="rounded-lg border border-border bg-white p-5 shadow-sm">
            <p className="text-sm text-muted">Today&apos;s Consultations</p>
            <p className="mt-2 font-heading text-2xl font-semibold text-navy">{todayConsultCount ?? 0}</p>
          </div>
          <div className="rounded-lg border border-border bg-white p-5 shadow-sm">
            <p className="text-sm text-muted">Medicine Orders</p>
            <p className="mt-2 font-heading text-2xl font-semibold text-navy">{orderCount ?? 0}</p>
          </div>
          <Link
            href="/admin/settings"
            className="rounded-lg border border-border bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <p className="text-sm text-muted">Settings</p>
            <p className="mt-2 font-heading text-2xl font-semibold text-navy">→</p>
          </Link>
        </div>

        <div className="mt-8 rounded-lg border border-border bg-white p-6 shadow-sm">
          <h2 className="font-heading text-lg font-semibold text-navy">
            Patient pipeline
          </h2>
          <div className="mt-6 flex items-center justify-between overflow-x-auto">
            {stages.map((stage, i) => (
              <div key={stage} className="flex items-center">
                <div className="whitespace-nowrap rounded-md border border-border bg-warm-white px-4 py-2 text-sm font-medium text-dark">
                  {stage}
                </div>
                {i < stages.length - 1 && (
                  <div className="mx-2 h-px w-6 bg-border" />
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border text-muted">
                <tr>
                  <th className="py-3 font-medium">Patient</th>
                  <th className="py-3 font-medium">Stage</th>
                  <th className="py-3 font-medium">Country</th>
                  <th className="py-3 font-medium">Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {casesList.map((row) => (
                  <tr key={row.id}>
                    <td className="py-3 text-dark">{row.dv_profiles?.name || "—"}</td>
                    <td className="py-3">
                      <span className="rounded-full bg-sage px-2.5 py-1 text-xs text-dark">
                        {row.status}
                      </span>
                    </td>
                    <td className="py-3 text-muted">{row.dv_profiles?.country || row.country || "—"}</td>
                    <td className="py-3 text-muted">
                      {new Date(row.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {casesList.length === 0 && (
                  <tr>
                    <td className="py-3 text-muted" colSpan={4}>
                      No cases yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
