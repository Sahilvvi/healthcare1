import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import { getSettings } from "./actions";
import { SettingsForm } from "./SettingsForm";

export default async function AdminSettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const { data: profile } = await supabase.from("dv_profiles").select("role").eq("id", user.id).single();
  const role = (profile as { role?: string } | null)?.role;
  if (role !== "admin" && role !== "doctor") {
    redirect("/patient/dashboard");
  }

  const settings = await getSettings();

  return (
    <section>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-semibold text-navy">Settings</h1>
        <p className="text-sm text-muted">Platform preferences and notifications</p>
      </div>

      <SettingsForm initial={settings} />
    </section>
  );
}
