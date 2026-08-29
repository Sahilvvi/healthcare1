import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import { ProfileForm } from "./ProfileForm";

export default async function PatientProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("dv_profiles")
    .select("name, phone, country")
    .eq("id", user.id)
    .single();

  return (
    <section className="bg-warm-white py-10 lg:py-16">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <Link href="/patient/dashboard" className="text-sm text-muted hover:text-teal">
          ← Back to dashboard
        </Link>

        <h1 className="mt-6 font-heading text-3xl font-semibold text-navy">
          Your profile
        </h1>

        <div className="mt-8">
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
    </section>
  );
}
