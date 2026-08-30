"use server";

import { supabaseAdmin } from "@/app/lib/supabase/admin";

export async function updateCaseStatus(formData: FormData) {
  const caseId = formData.get("caseId") as string;
  const status = formData.get("status") as string;

  if (!caseId || !status) {
    return { error: "Case and status are required." };
  }

  const { error } = await supabaseAdmin.from("dv_cases").update({ status }).eq("id", caseId);
  if (error) {
    return { error: error.message };
  }

  await supabaseAdmin.from("dv_case_timeline").insert({
    case_id: caseId,
    stage: status,
    note: `Status updated to ${status}`,
  });

  return { ok: true };
}

export async function assignCoordinator(formData: FormData) {
  const caseId = formData.get("caseId") as string;
  const coordinatorId = (formData.get("coordinatorId") as string)?.trim() || null;

  if (!caseId) {
    return { error: "Case is required." };
  }

  const { error } = await supabaseAdmin
    .from("dv_cases")
    .update({ coordinator_id: coordinatorId })
    .eq("id", caseId);

  if (error) {
    return { error: error.message };
  }

  return { ok: true };
}
