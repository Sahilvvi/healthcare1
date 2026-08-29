import { notFound } from "next/navigation";
import { doctors } from "../../lib/doctors";
import { BookingFlow } from "./BookingFlow";

export function generateStaticParams() {
  return doctors.map((doctor) => ({ slug: doctor.slug }));
}

export default async function BookPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doctor = doctors.find((d) => d.slug === slug);
  if (!doctor) notFound();

  return <BookingFlow doctor={doctor} />;
}
