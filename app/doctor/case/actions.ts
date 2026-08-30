"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/app/lib/supabase/server";
import { supabaseAdmin } from "@/app/lib/supabase/admin";

export async function addCaseNote(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Not authenticated." };
  }

  const caseId = (formData.get("caseId") as string)?.trim();
  const note = (formData.get("note") as string)?.trim();

  if (!caseId || !note) {
    return { error: "Case and note are required." };
  }

  const { error } = await supabaseAdmin.from("dv_case_notes").insert({
    case_id: caseId,
    doctor_id: user.id,
    note,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/doctor/case/${caseId}`, "page");
  return { ok: true };
}

export async function addPrescription(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Not authenticated." };
  }

  const caseId = (formData.get("caseId") as string)?.trim();
  const patientId = (formData.get("patientId") as string)?.trim();
  const name = (formData.get("name") as string)?.trim();
  const dosage = (formData.get("dosage") as string)?.trim();
  const duration = (formData.get("duration") as string)?.trim();

  if (!caseId || !patientId || !name || !dosage) {
    return { error: "Case, patient, medicine and dosage are required." };
  }

  const { error } = await supabaseAdmin.from("dv_prescriptions").insert({
    case_id: caseId,
    patient_id: patientId,
    doctor_id: user.id,
    medications: [{ name, dosage, duration: duration || "As directed", frequency: "As directed" }],
    status: "ACTIVE",
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/doctor/case/${caseId}`, "page");
  return { ok: true };
}

export async function scheduleFollowUp(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Not authenticated." };
  }

  const caseId = (formData.get("caseId") as string)?.trim();
  const type = (formData.get("type") as string) || "FOLLOW_UP";
  const scheduledAt = (formData.get("scheduledAt") as string)?.trim();

  if (!caseId || !scheduledAt) {
    return { error: "Case and date are required." };
  }

  const { data: doctor } = await supabaseAdmin.from("dv_doctors").select("id").eq("user_id", user.id).single();
  if (!doctor) {
    return { error: "Doctor profile not linked." };
  }

  const room = type === "TELECONSULTATION" ? `dvh-${caseId.slice(0, 8)}-${Date.now()}` : null;

  const { error } = await supabaseAdmin.from("dv_appointments").insert({
    case_id: caseId,
    doctor_id: doctor.id,
    type,
    scheduled_at: new Date(scheduledAt).toISOString(),
    status: "CONFIRMED",
    link: room ? `https://meet.jit.si/${room}` : null,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/doctor/case/${caseId}`, "page");
  return { ok: true };
}
