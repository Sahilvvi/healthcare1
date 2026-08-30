"use server";

import { createClient } from "@/app/lib/supabase/server";
import { supabaseAdmin } from "@/app/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function createPrescription(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const caseId = (formData.get("caseId") as string)?.trim();
  const notes = (formData.get("notes") as string)?.trim();
  const medicationsRaw = (formData.get("medications") as string) || "[]";

  if (!caseId) return { error: "Case is required" };

  let medications: unknown[];
  try {
    medications = JSON.parse(medicationsRaw);
    if (!Array.isArray(medications)) throw new Error("not an array");
  } catch {
    return { error: "Invalid medications" };
  }

  const { data: caseData } = await supabaseAdmin.from("dv_cases").select("patient_id").eq("id", caseId).single();
  if (!caseData) return { error: "Case not found" };

  const { error } = await supabaseAdmin.from("dv_prescriptions").insert({
    case_id: caseId,
    patient_id: caseData.patient_id,
    doctor_id: user.id,
    medications,
    notes: notes || null,
  });

  if (error) return { error: error.message };

  revalidatePath("/doctor/prescriptions");
  revalidatePath("/patient/prescriptions");
  return { ok: true };
}
