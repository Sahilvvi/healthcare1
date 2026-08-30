import { Hero } from "./components/Hero";
import { Reveal } from "./components/Reveal";
import { StatsStrip } from "./components/StatsStrip";
import { TreatmentCategories } from "./components/TreatmentCategories";
import { Journey } from "./components/Journey";
import { WhyChooseUs } from "./components/WhyChooseUs";
import { TreatmentPackages } from "./components/TreatmentPackages";
import { DoctorCards } from "./components/DoctorCards";
import { TestimonialPreview } from "./components/TestimonialPreview";
import { FinalCTA } from "./components/FinalCTA";
import { HowItWorksPreview } from "./components/HowItWorksPreview";
import { FeaturedHospitals } from "./components/FeaturedHospitals";
import { TrustSection } from "./components/TrustSection";
import { FAQSection } from "./components/FAQSection";
import { supabasePublic } from "./lib/supabase/public";
import type { Doctor, Hospital, Package } from "./lib/types";

export const revalidate = 60;

async function fetchHomeData() {
  const [{ data: doctorsData }, { data: packagesData }, { data: hospitalsData }] =
    await Promise.all([
      supabasePublic.from("dv_doctors").select("*").order("rating", { ascending: false }).limit(3),
      supabasePublic.from("dv_packages").select("*").order("price").limit(3),
      supabasePublic.from("dv_hospitals").select("*").limit(4),
    ]);

  const doctors = (doctorsData as Doctor[]) || [];
  const packages = (packagesData as Package[]) || [];
  const hospitals = (hospitalsData as Hospital[]) || [];

  const [{ count: patientsCount }, { count: doctorsCount }, { count: hospitalsCount }, { data: countriesData }] =
    await Promise.all([
      supabasePublic.from("dv_cases").select("*", { count: "exact", head: true }),
      supabasePublic.from("dv_doctors").select("*", { count: "exact", head: true }),
      supabasePublic.from("dv_hospitals").select("*", { count: "exact", head: true }),
      supabasePublic.from("dv_profiles").select("country").eq("role", "patient"),
    ]);

  const countries = new Set((countriesData || []).map((c: { country?: string | null }) => c.country).filter(Boolean));

  const stats = [
    { value: patientsCount ? `${Math.max(patientsCount, 1)}+` : "1,200+", label: "Patients guided" },
    { value: hospitalsCount ? `${hospitalsCount}+` : "40+", label: "Verified hospitals" },
    { value: doctorsCount ? `${doctorsCount}+` : "60+", label: "Specialist doctors" },
    { value: countries.size ? `${countries.size}+` : "15+", label: "Countries served" },
  ];

  return { doctors, packages, hospitals, stats };
}

export default async function Home() {
  const { doctors, packages, hospitals, stats } = await fetchHomeData();

  return (
    <>
      <Hero />
      <StatsStrip stats={stats} />
      <Reveal>
        <TreatmentCategories />
      </Reveal>
      <Journey />
      <Reveal delay={100}>
        <WhyChooseUs />
      </Reveal>
      <Reveal delay={100}>
        <TreatmentPackages packages={packages} />
      </Reveal>
      <Reveal delay={100}>
        <DoctorCards doctors={doctors} />
      </Reveal>
      <Reveal delay={100}>
        <HowItWorksPreview />
      </Reveal>
      <Reveal delay={100}>
        <FeaturedHospitals hospitals={hospitals} />
      </Reveal>
      <Reveal delay={100}>
        <TrustSection />
      </Reveal>
      <Reveal delay={100}>
        <TestimonialPreview />
      </Reveal>
      <Reveal delay={100}>
        <FAQSection />
      </Reveal>
      <FinalCTA />
    </>
  );
}
