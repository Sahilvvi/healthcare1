import { supabasePublic } from "@/app/lib/supabase/public";
import { doctors as fallbackDoctors } from "@/app/lib/doctors";
import { packages as fallbackPackages } from "@/app/lib/packages";
import { TreatmentPlanFlow } from "./TreatmentPlanFlow";
import type { Doctor, Package } from "@/app/lib/types";

const categoryMap = [
  { key: "cardiology", label: "Cardiology", specialties: ["Cardiology"] },
  { key: "cancer-care", label: "Cancer Care", specialties: ["Oncology", "Cancer Care"] },
  { key: "orthopedics", label: "Bones & Joints", specialties: ["Orthopedics"] },
  { key: "neurology", label: "Neurology", specialties: ["Neurology"] },
  { key: "transplants", label: "Organ Transplant", specialties: ["Transplants", "Organ Transplant", "Transplant"] },
  { key: "womens-health", label: "Women's Health", specialties: ["Women's Health", "Gynaecology", "Gynecology", "Obstetrics"] },
  { key: "dental", label: "Dental", specialties: ["Dental", "Dentistry"] },
  { key: "wellness", label: "Wellness Checkup", specialties: ["Wellness", "General Physician", "Internal Medicine"] },
];

function normalize(text?: string | null) {
  return (text || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

function matchCategory(specialty?: string | null) {
  if (!specialty) return undefined;
  const normalized = normalize(specialty);
  return categoryMap.find((c) => c.specialties.some((s) => normalize(s) === normalized || normalized.includes(normalize(s))));
}

export default async function TreatmentPlanPage() {
  const [{ data: doctorsData }, { data: packagesData }] = await Promise.all([
    supabasePublic.from("dv_doctors").select("*"),
    supabasePublic.from("dv_packages").select("*"),
  ]);

  const doctors: Doctor[] = (doctorsData as Doctor[])?.length ? (doctorsData as Doctor[]) : (fallbackDoctors as unknown as Doctor[]);
  const packages: Package[] = (packagesData as Package[])?.length ? (packagesData as Package[]) : (fallbackPackages as unknown as Package[]);

  const categories = categoryMap.map((c) => ({ key: c.key, label: c.label }));

  const doctorsByCategory: Record<string, { name: string; specialty: string }[]> = {};
  for (const category of categoryMap) {
    doctorsByCategory[category.key] = doctors
      .filter((d) => category.specialties.some((s) => normalize(d.specialty).includes(normalize(s))))
      .map((d) => ({ name: d.name, specialty: d.specialty }));
  }

  const fallbackSummaries: Record<string, { title: string; doctor: string; hospital: string; cost: string; stay: string }> = {
    cardiology: { title: "Cardiac Evaluation & Intervention Package", doctor: "Dr. Ananya Sharma", hospital: "Apollo Chennai", cost: "$3,500", stay: "5–7 days" },
    "cancer-care": { title: "Oncology Evaluation Package", doctor: "Dr. Priya Kulkarni", hospital: "Tata Memorial Mumbai", cost: "$2,800", stay: "7–10 days" },
    orthopedics: { title: "Knee Replacement Package", doctor: "Dr. Rajiv Menon", hospital: "Apollo Chennai", cost: "$4,800", stay: "10–14 days" },
    neurology: { title: "Neurology Consultation & Investigation Package", doctor: "Dr. Vikram Iyer", hospital: "NIMHANS Bengaluru", cost: "$2,200", stay: "5–7 days" },
    transplants: { title: "Transplant Evaluation & Coordination", doctor: "Assigned transplant team", hospital: "Apollo Chennai", cost: "On request", stay: "30–45 days" },
    "womens-health": { title: "Women's Health Screening Package", doctor: "Assigned gynaecology specialist", hospital: "Apollo Chennai", cost: "$800", stay: "2–3 days" },
    dental: { title: "Dental Implants Package", doctor: "Assigned dental surgeon", hospital: "Apollo Chennai", cost: "$1,200", stay: "5–7 days" },
    wellness: { title: "Executive Wellness Checkup", doctor: "Assigned physician", hospital: "Apollo Chennai", cost: "$600", stay: "1–2 days" },
  };

  const summaries: Record<string, { title: string; doctor: string; hospital: string; cost: string; stay: string }> = {};
  for (const category of categoryMap) {
    const pkg = packages.find((p) => {
      const matched = matchCategory(p.specialty);
      return matched?.key === category.key;
    });
    if (pkg) {
      const categoryDoctors = doctorsByCategory[category.key];
      const firstDoctor = categoryDoctors[0]?.name || "Assigned specialist";
      summaries[category.key] = {
        title: pkg.name,
        doctor: firstDoctor,
        hospital: pkg.hospitals?.[0] || "Recommended hospital",
        cost: pkg.price || "On request",
        stay: pkg.stay || "TBC",
      };
    } else {
      summaries[category.key] = fallbackSummaries[category.key];
    }
  }

  return <TreatmentPlanFlow categories={categories} doctorsByCategory={doctorsByCategory} summaries={summaries} />;
}
