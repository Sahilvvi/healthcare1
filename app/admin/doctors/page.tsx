import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import { supabaseAdmin } from "@/app/lib/supabase/admin";
import type { Doctor } from "@/app/lib/types";
import { AddDoctorForm } from "./AddDoctorForm";

export default async function AdminDoctorsPage() {
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
    .select("role")
    .eq("id", user.id)
    .single();

  const role = (profile as { role?: string } | null)?.role;
  if (role !== "admin" && role !== "doctor") {
    redirect("/patient/dashboard");
  }

  const { data: doctorsData } = await supabaseAdmin
    .from("dv_doctors")
    .select("*")
    .order("name");

  const doctors: Doctor[] = (doctorsData as Doctor[]) || [];

  return (
    <section>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-semibold text-navy">Doctors</h1>
        <p className="text-sm text-muted">Verified specialists and availability</p>
      </div>

      <AddDoctorForm />

      <div className="grid gap-4">
        {doctors.map((doctor) => (
          <div
            key={doctor.id}
            className="flex flex-col justify-between gap-4 rounded-lg border border-border bg-white p-5 shadow-sm sm:flex-row sm:items-center"
          >
            <div>
              <h3 className="font-heading font-semibold text-navy">{doctor.name}</h3>
              <p className="text-sm text-teal">{doctor.specialty}</p>
              <p className="text-sm text-muted">{doctor.experience} · {doctor.procedures} procedures</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="rounded-full bg-sage px-3 py-1 text-xs font-medium text-dark">
                {doctor.availability}
              </span>
              <Link
                href={`/doctors/${doctor.slug}`}
                className="text-sm font-medium text-teal hover:text-navy"
              >
                View profile →
              </Link>
            </div>
          </div>
        ))}
        {doctors.length === 0 && (
          <p className="text-muted">No doctors found. Seed the database first.</p>
        )}
      </div>
    </section>
  );
}
