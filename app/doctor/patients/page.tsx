import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import { supabaseAdmin } from "@/app/lib/supabase/admin";
import { SectionHeader } from "@/app/components/dashboard/SectionHeader";
import { Badge } from "@/app/components/dashboard/Badge";
import { isDoctor } from "@/app/lib/roles";
import type { Case } from "@/app/lib/types";

export default async function DoctorPatientsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("dv_profiles").select("role").eq("id", user.id).single();
  if (!isDoctor(profile?.role)) redirect("/login");

  const { data: cases } = await supabaseAdmin
    .from("dv_cases")
    .select("*, dv_profiles(name, country)")
    .order("created_at", { ascending: false })
    .limit(100);

  const caseList: (Case & { dv_profiles?: { name: string; country: string } | null })[] =
    (cases as unknown as (Case & { dv_profiles?: { name: string; country: string } | null })[]) || [];

  return (
    <div className="space-y-6">
      <SectionHeader title="Patients" subtitle="All patients under your care, organized by case status" />

      <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-warm-white text-muted">
            <tr>
              <th className="px-5 py-3 font-medium">Patient</th>
              <th className="px-5 py-3 font-medium">Country</th>
              <th className="px-5 py-3 font-medium">Case</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {caseList.map((p) => (
              <tr key={p.id}>
                <td className="px-5 py-4 text-dark">{p.dv_profiles?.name || "—"}</td>
                <td className="px-5 py-4 text-muted">{p.dv_profiles?.country || p.country || "—"}</td>
                <td className="px-5 py-4 text-muted">{p.condition || p.category || "—"}</td>
                <td className="px-5 py-4"><Badge tone="info">{p.status}</Badge></td>
                <td className="px-5 py-4 text-right">
                  <Link href={`/doctor/case/${p.id}`} className="text-sm font-medium text-teal hover:text-navy">Open case</Link>
                </td>
              </tr>
            ))}
            {caseList.length === 0 && (
              <tr>
                <td className="px-5 py-4 text-muted" colSpan={5}>No patients yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
