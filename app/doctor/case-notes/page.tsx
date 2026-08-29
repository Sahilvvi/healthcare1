import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import { supabaseAdmin } from "@/app/lib/supabase/admin";

interface CaseNote {
  id: string;
  case_id: string;
  doctor_id: string;
  note: string;
  created_at: string;
  dv_cases?: {
    patient_id: string;
    dv_profiles?: { name: string } | null;
  } | null;
}

export default async function DoctorCaseNotesPage() {
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

  const { data: notesData } = await supabaseAdmin
    .from("dv_case_notes")
    .select("*, dv_cases!case_id(patient_id, dv_profiles!patient_id(name))")
    .order("created_at", { ascending: false })
    .limit(50);

  const notes: CaseNote[] = (notesData as unknown as CaseNote[]) || [];

  return (
    <section className="bg-warm-white py-10 lg:py-16">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-3xl font-semibold text-navy md:text-4xl">Case notes</h1>
            <p className="mt-2 text-muted">Review and update patient case notes.</p>
          </div>
          <Link href="/doctor/dashboard" className="text-sm font-medium text-teal hover:text-navy">
            Back to dashboard
          </Link>
        </div>

        <div className="space-y-4">
          {notes.map((n) => (
            <div key={n.id} className="rounded-lg border border-border bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="font-heading font-semibold text-navy">
                  {n.dv_cases?.dv_profiles?.name || "Patient"}
                </p>
                <span className="text-xs text-muted">{new Date(n.created_at).toLocaleDateString()}</span>
              </div>
              <p className="mt-2 text-sm text-muted">{n.note}</p>
            </div>
          ))}
          {notes.length === 0 && (
            <p className="text-sm text-muted">No case notes yet.</p>
          )}
        </div>
      </div>
    </section>
  );
}
