"use server";

import { createClient } from "@/app/lib/supabase/server";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Not authenticated" };
  }

  const updates = {
    name: formData.get("name") as string,
    phone: formData.get("phone") as string,
    country: formData.get("country") as string,
  };

  const { error } = await supabase.from("dv_profiles").update(updates).eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  return { ok: true };
}
