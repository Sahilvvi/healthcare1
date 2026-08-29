import { Hero } from "./components/Hero";
import { TreatmentCategories } from "./components/TreatmentCategories";
import { Journey } from "./components/Journey";
import { TreatmentPackages } from "./components/TreatmentPackages";
import { DoctorCards } from "./components/DoctorCards";

export default function Home() {
  return (
    <>
      <Hero />
      <TreatmentCategories />
      <Journey />
      <TreatmentPackages />
      <DoctorCards />
    </>
  );
}
