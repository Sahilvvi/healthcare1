"use server";

import { supabaseAdmin } from "@/app/lib/supabase/admin";

export async function submitContact(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const message = (formData.get("message") as string)?.trim();

  if (!name || !email || !message) {
    return { error: "Please fill in all fields." };
  }

  const { error } = await supabaseAdmin.from("dv_contact_submissions").insert({
    name,
    email,
    message,
  });

  if (error) {
    return { error: error.message };
  }

  return { ok: true };
}
