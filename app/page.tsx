import { Hero } from "./components/Hero";
import { Reveal } from "./components/Reveal";
import { TreatmentCategories } from "./components/TreatmentCategories";
import { Journey } from "./components/Journey";
import { TreatmentPackages } from "./components/TreatmentPackages";
import { DoctorCards } from "./components/DoctorCards";

export default function Home() {
  return (
    <>
      <Hero />
      <Reveal>
        <TreatmentCategories />
      </Reveal>
      <Journey />
      <Reveal delay={100}>
        <TreatmentPackages />
      </Reveal>
      <Reveal delay={100}>
        <DoctorCards />
      </Reveal>
    </>
  );
}
