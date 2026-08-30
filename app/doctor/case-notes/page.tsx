import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import { supabaseAdmin } from "@/app/lib/supabase/admin";
import { SectionHeader } from "@/app/components/dashboard/SectionHeader";
import { Badge } from "@/app/components/dashboard/Badge";
import { isDoctor } from "@/app/lib/roles";
import { CaseNoteForm } from "./CaseNoteForm";

interface CaseNote {
  id: string;
  case_id: string;
  note: string;
  created_at: string;
  dv_cases?: {
    dv_profiles?: { name: string } | null;
  } | null;
}

function formatDate(ts: string) {
  return new Date(ts).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default async function DoctorCaseNotesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("dv_profiles").select("role").eq("id", user.id).single();
  if (!isDoctor(profile?.role)) redirect("/login");

  const [{ data: notesData }, { data: cases }] = await Promise.all([
    supabaseAdmin
      .from("dv_case_notes")
      .select("*, dv_cases!case_id(id, patient_id, dv_profiles!patient_id(name))")
      .order("created_at", { ascending: false })
      .limit(50),
    supabaseAdmin.from("dv_cases").select("id, category, patient_id").order("created_at", { ascending: false }).limit(50),
  ]);

  const notes: CaseNote[] = (notesData as unknown as CaseNote[]) || [];

  return (
    <div className="space-y-8">
      <SectionHeader title="Case notes" subtitle="Review and update patient case notes" />

      <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
        <h2 className="font-heading text-lg font-semibold text-navy">Add note</h2>
        <CaseNoteForm cases={cases || []} />
      </div>

      <div className="space-y-4">
        {notes.map((n) => (
          <div key={n.id} className="rounded-xl border border-border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="font-heading font-semibold text-navy">{n.dv_cases?.dv_profiles?.name || "Patient"}</p>
              <Badge tone="info">{formatDate(n.created_at)}</Badge>
            </div>
            <p className="mt-3 text-sm text-muted">{n.note}</p>
          </div>
        ))}
        {notes.length === 0 && <p className="text-sm text-muted">No case notes yet.</p>}
      </div>
    </div>
  );
}
