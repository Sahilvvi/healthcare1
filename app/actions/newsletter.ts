"use server";

import { createClient } from "@/app/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function subscribeNewsletter(formData: FormData) {
  const email = (formData.get("email") as string)?.trim().toLowerCase();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("dv_contact_submissions").insert({
    name: "Newsletter subscriber",
    email,
    message: "Subscribed via footer form",
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  return { ok: true };
}
