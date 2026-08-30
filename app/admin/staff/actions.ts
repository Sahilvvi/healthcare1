"use server";

import { createClient } from "@/app/lib/supabase/server";
import { supabaseAdmin } from "@/app/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function updateUserRole(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { data: me } = await supabase.from("dv_profiles").select("role").eq("id", user.id).single();
  if (me?.role !== "admin" && me?.role !== "superadmin") return { error: "Unauthorized" };

  const userId = (formData.get("userId") as string)?.trim();
  const role = (formData.get("role") as string)?.trim();
  if (!userId || !role) return { error: "User and role are required" };

  const { error } = await supabaseAdmin.from("dv_profiles").update({ role }).eq("id", userId);
  if (error) return { error: error.message };
  revalidatePath("/admin/staff");
  return { ok: true };
}
