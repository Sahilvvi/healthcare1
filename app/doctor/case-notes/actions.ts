"use server";

import { createClient } from "@/app/lib/supabase/server";
import { supabaseAdmin } from "@/app/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function addCaseNote(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const caseId = (formData.get("caseId") as string)?.trim();
  const note = (formData.get("note") as string)?.trim();

  if (!caseId || !note) return { error: "Case and note are required" };

  const { error } = await supabaseAdmin.from("dv_case_notes").insert({
    case_id: caseId,
    doctor_id: user.id,
    note,
  });

  if (error) return { error: error.message };

  revalidatePath("/doctor/case-notes");
  return { ok: true };
}
