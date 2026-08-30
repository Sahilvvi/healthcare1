"use server";

import { createClient } from "@/app/lib/supabase/server";
import { supabaseAdmin } from "@/app/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function createTransaction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const description = (formData.get("description") as string)?.trim();
  const category = (formData.get("category") as string)?.trim() || null;
  const type = (formData.get("type") as "income" | "cost" | "refund") || "income";
  const amount = Number(formData.get("amount"));

  if (!description || Number.isNaN(amount) || amount <= 0) {
    return { error: "Description and positive amount are required" };
  }

  const { error } = await supabaseAdmin.from("dv_transactions").insert({
    type,
    amount,
    currency: "USD",
    description,
    category,
  });

  if (error) return { error: error.message };
  revalidatePath("/admin/finance");
  return { ok: true };
}
