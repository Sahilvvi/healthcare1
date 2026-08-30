import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import { supabaseAdmin } from "@/app/lib/supabase/admin";
import { SectionHeader } from "@/app/components/dashboard/SectionHeader";
import { Badge } from "@/app/components/dashboard/Badge";
import { isAdmin } from "@/app/lib/roles";
import type { Doctor } from "@/app/lib/types";
import { AddDoctorForm } from "./AddDoctorForm";

export default async function AdminDoctorsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("dv_profiles").select("role").eq("id", user.id).single();
  if (!isAdmin(profile?.role)) redirect("/login");

  const { data: doctorsData } = await supabaseAdmin.from("dv_doctors").select("*").order("name");
  const doctors: Doctor[] = (doctorsData as Doctor[]) || [];

  return (
    <div className="space-y-8">
      <SectionHeader title="Doctors" subtitle="Verified specialists and availability" />

      <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
        <h2 className="font-heading text-lg font-semibold text-navy">Add a doctor</h2>
        <AddDoctorForm />
      </div>

      <div className="grid gap-4">
        {doctors.map((doctor) => (
          <div key={doctor.id} className="flex flex-col justify-between gap-4 rounded-xl border border-border bg-white p-5 shadow-sm sm:flex-row sm:items-center">
            <div>
              <h3 className="font-heading font-semibold text-navy">{doctor.name}</h3>
              <p className="text-sm text-teal">{doctor.specialty}</p>
              <p className="text-sm text-muted">{doctor.experience} · {doctor.procedures} procedures</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge tone={doctor.availability?.toLowerCase().includes("available") ? "success" : "default"}>{doctor.availability}</Badge>
              <Link href={`/doctors/${doctor.slug}`} className="text-sm font-medium text-teal hover:text-navy">View profile →</Link>
            </div>
          </div>
        ))}
        {doctors.length === 0 && <p className="text-muted">No doctors found.</p>}
      </div>
    </div>
  );
}
