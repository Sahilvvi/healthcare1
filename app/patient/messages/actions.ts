"use server";

import { createClient } from "@/app/lib/supabase/server";

export async function sendMessage(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Not authenticated" };
  }

  const caseId = formData.get("caseId") as string;
  const content = formData.get("content") as string;

  if (!caseId || !content?.trim()) {
    return { error: "Message cannot be empty" };
  }

  const { error } = await supabase.from("dv_messages").insert({
    case_id: caseId,
    sender_id: user.id,
    content: content.trim(),
  });

  if (error) {
    return { error: error.message };
  }

  return { ok: true };
}
