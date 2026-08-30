"use server";

import { createClient } from "@/app/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createSupportTicket(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const subject = (formData.get("subject") as string)?.trim();
  const message = (formData.get("message") as string)?.trim();
  const priority = (formData.get("priority") as string) || "MEDIUM";

  if (!subject || !message) return { error: "Subject and message are required" };

  const { error } = await supabase.from("dv_support_tickets").insert({
    user_id: user.id,
    subject,
    message,
    priority,
    status: "OPEN",
  });

  if (error) return { error: error.message };
  revalidatePath("/patient/support");
  return { ok: true };
}
