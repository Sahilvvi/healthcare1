import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import { SectionHeader } from "@/app/components/dashboard/SectionHeader";
import { ProfileForm } from "../profile/ProfileForm";

export default async function PatientSettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("dv_profiles")
    .select("name, phone, country")
    .eq("id", user.id)
    .single();

  return (
    <div className="space-y-6">
      <SectionHeader title="Settings" subtitle="Update your profile and preferences" />
      <div className="rounded-xl border border-border bg-white p-6 shadow-sm lg:p-8">
        <ProfileForm
          initial={{
            name: profile?.name || "",
            phone: profile?.phone || null,
            country: profile?.country || null,
          }}
          email={user.email}
        />
      </div>
    </div>
  );
}
