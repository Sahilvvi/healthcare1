import { notFound, redirect } from "next/navigation";
import { supabasePublic } from "@/app/lib/supabase/public";
import { createClient } from "@/app/lib/supabase/server";
import type { Doctor } from "@/app/lib/types";
import { BookingFlow } from "./BookingFlow";

export default async function BookPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: doctorData, error: doctorError } = await supabasePublic
    .from("dv_doctors")
    .select("*")
    .eq("slug", slug)
    .single();

  if (doctorError || !doctorData) {
    console.error("Failed to fetch doctor:", doctorError?.message);
    notFound();
  }

  const doctor = doctorData as Doctor;

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
    .select("name")
    .eq("id", user.id)
    .single();

  const { data: cases } = await supabase
    .from("dv_cases")
    .select("id")
    .eq("patient_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1);

  if (!cases || cases.length === 0) {
    redirect("/patient/case");
  }

  return (
    <BookingFlow
      doctor={doctor}
      caseId={cases[0].id}
      patientName={profile?.name || "Patient"}
      patientEmail={user.email || ""}
    />
  );
}
