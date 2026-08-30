import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import { supabaseAdmin } from "@/app/lib/supabase/admin";
import { SectionHeader } from "@/app/components/dashboard/SectionHeader";
import { isAdmin } from "@/app/lib/roles";
import type { Hospital } from "@/app/lib/types";
import { AddHospitalForm } from "./AddHospitalForm";

export default async function AdminHospitalsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("dv_profiles").select("role").eq("id", user.id).single();
  if (!isAdmin(profile?.role)) redirect("/login");

  const { data: hospitalsData } = await supabaseAdmin.from("dv_hospitals").select("*").order("name");
  const hospitals: Hospital[] = (hospitalsData as Hospital[]) || [];

  return (
    <div className="space-y-8">
      <SectionHeader title="Hospitals" subtitle="Accredited centres and international patient services" />

      <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
        <h2 className="font-heading text-lg font-semibold text-navy">Add a hospital</h2>
        <AddHospitalForm />
      </div>

      <div className="grid gap-4">
        {hospitals.map((hospital) => (
          <div key={hospital.id} className="flex flex-col justify-between gap-4 rounded-xl border border-border bg-white p-5 shadow-sm sm:flex-row sm:items-center">
            <div>
              <h3 className="font-heading font-semibold text-navy">{hospital.name}</h3>
              <p className="text-sm text-muted">{hospital.city}, {hospital.country}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {hospital.accreditations?.map((acc) => (
                  <span key={acc} className="rounded-md border border-border bg-warm-white px-2 py-1 text-xs text-dark">{acc}</span>
                ))}
              </div>
            </div>
            <Link href={`/hospitals/${hospital.slug}`} className="text-sm font-medium text-teal hover:text-navy">View profile →</Link>
          </div>
        ))}
        {hospitals.length === 0 && <p className="text-muted">No hospitals found.</p>}
      </div>
    </div>
  );
}
