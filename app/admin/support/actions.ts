"use server";

import { createClient } from "@/app/lib/supabase/server";
import { supabaseAdmin } from "@/app/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function updateTicketStatus(ticketId: string, status: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { data: profile } = await supabase.from("dv_profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin" && profile?.role !== "superadmin") return { error: "Unauthorized" };

  const { error } = await supabaseAdmin.from("dv_support_tickets").update({ status, updated_at: new Date().toISOString() }).eq("id", ticketId);
  if (error) return { error: error.message };
  revalidatePath("/admin/support");
  return { ok: true };
}
