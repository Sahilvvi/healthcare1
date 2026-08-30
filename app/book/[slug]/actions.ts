"use server";

import { supabaseAdmin } from "@/app/lib/supabase/admin";

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function parseSlotToDate(slot: string): Date {
  const [dayPart, timePart] = slot.split(", ");
  const targetDay = dayNames.indexOf(dayPart);
  const now = new Date();
  const currentDay = now.getDay();
  const daysUntil = (targetDay - currentDay + 7) % 7 || 7;
  const date = new Date(now);
  date.setDate(now.getDate() + daysUntil);

  const parsed = new Date(`${date.toDateString()} ${timePart}`);
  if (isNaN(parsed.getTime())) {
    return date;
  }
  return parsed;
}

export async function bookAppointment({
  caseId,
  doctorId,
  slot,
}: {
  caseId: string;
  doctorId: string;
  slot: string;
}) {
  const scheduledAt = parseSlotToDate(slot).toISOString();
  const room = `dvh-${caseId.slice(0, 8)}-${Date.now()}`;

  const { data: appointment, error } = await supabaseAdmin
    .from("dv_appointments")
    .insert({
      case_id: caseId,
      doctor_id: doctorId,
      type: "Video Consultation",
      scheduled_at: scheduledAt,
      status: "SCHEDULED",
      link: `https://meet.jit.si/${room}`,
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  await supabaseAdmin.from("dv_case_timeline").insert({
    case_id: caseId,
    stage: "CONSULTATION",
    note: `Consultation scheduled for ${slot}`,
  });

  await supabaseAdmin
    .from("dv_cases")
    .update({ status: "CONSULTATION" })
    .eq("id", caseId);

  return { ok: true, appointmentId: appointment.id };
}
