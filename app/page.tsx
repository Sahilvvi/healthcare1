import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { TreatmentCategories } from "./components/TreatmentCategories";
import { Journey } from "./components/Journey";
import { TreatmentPackages } from "./components/TreatmentPackages";
import { DoctorCards } from "./components/DoctorCards";
import { Footer } from "./components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <TreatmentCategories />
        <Journey />
        <TreatmentPackages />
        <DoctorCards />
      </main>
      <Footer />
    </>
  );
}
