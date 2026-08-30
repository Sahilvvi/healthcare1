"use server";

import { supabaseAdmin } from "@/app/lib/supabase/admin";

export async function updateOrderStatus(formData: FormData) {
  const id = formData.get("id") as string;
  const status = formData.get("status") as string;

  if (!id || !status) {
    return { error: "Order ID and status are required." };
  }

  const { error } = await supabaseAdmin
    .from("dv_medicine_orders")
    .update({ status })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  return { ok: true };
}
