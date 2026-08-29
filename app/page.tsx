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

export default function Home() {
  return (
    <>
      <Hero />
      <StatsStrip />
      <Reveal>
        <TreatmentCategories />
      </Reveal>
      <Journey />
      <Reveal delay={100}>
        <WhyChooseUs />
      </Reveal>
      <Reveal delay={100}>
        <TreatmentPackages />
      </Reveal>
      <Reveal delay={100}>
        <DoctorCards />
      </Reveal>
      <Reveal delay={100}>
        <TestimonialPreview />
      </Reveal>
      <FinalCTA />
    </>
  );
}
