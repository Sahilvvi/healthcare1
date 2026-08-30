import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import { SectionHeader } from "@/app/components/dashboard/SectionHeader";
import { isAdmin } from "@/app/lib/roles";
import { getSettings } from "./actions";
import { SettingsForm } from "./SettingsForm";

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("dv_profiles").select("role").eq("id", user.id).single();
  if (!isAdmin(profile?.role)) redirect("/login");

  const settings = await getSettings();

  return (
    <div className="space-y-6">
      <SectionHeader title="Settings" subtitle="Platform preferences and notifications" />
      <SettingsForm initial={settings} />
    </div>
  );
}
