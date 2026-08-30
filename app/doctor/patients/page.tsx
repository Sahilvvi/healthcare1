import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import { supabaseAdmin } from "@/app/lib/supabase/admin";
import type { Case } from "@/app/lib/types";

export default async function DoctorPatientsPage() {
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

  const { data: cases } = await supabaseAdmin
    .from("dv_cases")
    .select("*, dv_profiles(name, country)")
    .order("created_at", { ascending: false })
    .limit(50);

  const caseList: (Case & { dv_profiles?: { name: string; country: string } | null })[] =
    (cases as unknown as (Case & { dv_profiles?: { name: string; country: string } | null })[]) || [];

  return (
    <section className="bg-warm-white py-10 lg:py-16">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-3xl font-semibold text-navy md:text-4xl">Patients</h1>
            <p className="mt-2 text-muted">All patients under your care.</p>
          </div>
          <Link href="/doctor/dashboard" className="text-sm font-medium text-teal hover:text-navy">
            Back to dashboard
          </Link>
        </div>

        <div className="rounded-lg border border-border bg-white p-6 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border text-muted">
                <tr>
                  <th className="py-3 font-medium">Patient</th>
                  <th className="py-3 font-medium">Country</th>
                  <th className="py-3 font-medium">Case</th>
                  <th className="py-3 font-medium">Status</th>
                  <th className="py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {caseList.map((p) => (
                  <tr key={p.id}>
                    <td className="py-4 text-dark">{p.dv_profiles?.name || "—"}</td>
                    <td className="py-4 text-muted">{p.dv_profiles?.country || p.country || "—"}</td>
                    <td className="py-4 text-muted">{p.condition || p.category || "—"}</td>
                    <td className="py-4">
                      <span className="rounded-full bg-sage px-2.5 py-1 text-xs text-dark">{p.status}</span>
                    </td>
                    <td className="py-4 text-right">
                      <Link href={`/doctor/case/${p.id}`} className="text-sm font-medium text-teal hover:text-navy">
                        Open case
                      </Link>
                    </td>
                  </tr>
                ))}
                {caseList.length === 0 && (
                  <tr>
                    <td className="py-4 text-muted" colSpan={5}>
                      No patients yet.
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
