"use server";

import { supabaseAdmin } from "@/app/lib/supabase/admin";

export type AdminSettings = {
  email_notifications: boolean;
  sms_alerts: boolean;
  currency: string;
};

export async function getSettings(): Promise<AdminSettings> {
  const { data, error } = await supabaseAdmin.from("dv_settings").select("value").eq("key", "admin").single();
  if (error || !data) {
    return {
      email_notifications: true,
      sms_alerts: false,
      currency: "USD + INR",
    };
  }
  return (data.value as AdminSettings) || {};
}

export async function updateSettings(formData: FormData) {
  const email_notifications = formData.get("email_notifications") === "on";
  const sms_alerts = formData.get("sms_alerts") === "on";
  const currency = (formData.get("currency") as string) || "USD + INR";

  const { error } = await supabaseAdmin
    .from("dv_settings")
    .upsert({
      key: "admin",
      value: { email_notifications, sms_alerts, currency },
      updated_at: new Date().toISOString(),
    });

  if (error) {
    return { error: error.message };
  }

  return { ok: true };
}
