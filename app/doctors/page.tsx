import { supabasePublic } from "@/app/lib/supabase/public";
import type { Doctor } from "@/app/lib/types";
import DoctorsList from "./DoctorsList";

export default async function DoctorsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const initialFilter = Array.isArray(params.specialty) ? params.specialty[0] : params.specialty;
  const { data, error } = await supabasePublic.from("dv_doctors").select("*");
  if (error) {
    console.error("Failed to fetch doctors:", error.message);
  }
  const doctors: Doctor[] = (data as Doctor[]) || [];
  return <DoctorsList doctors={doctors} initialFilter={initialFilter} />;
}
