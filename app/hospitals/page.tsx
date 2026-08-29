import { supabasePublic } from "@/app/lib/supabase/public";
import type { Hospital } from "@/app/lib/types";
import HospitalsList from "./HospitalsList";

export default async function HospitalsPage() {
  const { data, error } = await supabasePublic.from("dv_hospitals").select("*");
  if (error) {
    console.error("Failed to fetch hospitals:", error.message);
  }
  const hospitals: Hospital[] = (data as Hospital[]) || [];
  return <HospitalsList hospitals={hospitals} />;
}
