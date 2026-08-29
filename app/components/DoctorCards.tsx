import Image from "next/image";
import Link from "next/link";

const doctors = [
  {
    name: "Dr. Ananya Sharma",
    specialty: "Cardiology",
    experience: "18+ years",
    rating: "4.9",
    procedures: "1,200+",
    languages: ["English", "Hindi", "Arabic"],
    image:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800",
  },
  {
    name: "Dr. Rajiv Menon",
    specialty: "Orthopedics",
    experience: "22+ years",
    rating: "4.8",
    procedures: "3,400+",
    languages: ["English", "Hindi", "Tamil"],
    image:
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800",
  },
  {
    name: "Dr. Priya Kulkarni",
    specialty: "Oncology",
    experience: "15+ years",
    rating: "4.9",
    procedures: "900+",
    languages: ["English", "Hindi", "Marathi"],
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800",
  },
];

export function DoctorCards() {
  return (
    <section id="doctors" className="bg-warm-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-12 max-w-2xl">
          <h2 className="font-heading text-3xl font-semibold text-navy md:text-4xl">
            Leading specialists for your care
          </h2>
          <p className="mt-4 text-muted">
            Verified doctors with international experience, language support
            and transparent outcomes.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {doctors.map((doctor) => (
            <div
              key={doctor.name}
              className="group overflow-hidden rounded-lg border border-border bg-white shadow-sm transition-all duration-300 hover:shadow-md"
            >
              <div className="aspect-[4/3] overflow-hidden bg-sage">
                <Image
                  src={doctor.image}
                  alt={doctor.name}
                  width={800}
                  height={600}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-navy">
                      {doctor.name}
                    </h3>
                    <p className="text-sm text-teal">{doctor.specialty}</p>
                  </div>
                  <span className="flex items-center gap-1 rounded-full bg-champagne/40 px-2 py-1 text-xs font-medium text-navy">
                    <StarIcon />
                    {doctor.rating}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted">
                  <span>{doctor.experience} experience</span>
                  <span>{doctor.procedures} procedures</span>
                </div>
                <p className="mt-3 text-sm text-muted">
                  Languages: {doctor.languages.join(" · ")}
                </p>
                <div className="mt-6 flex gap-3">
                  <Link
                    href="#"
                    className="flex-1 rounded-md border border-border px-4 py-2.5 text-center text-sm font-medium text-dark transition-colors hover:border-navy hover:text-navy"
                  >
                    View Profile
                  </Link>
                  <Link
                    href="#"
                    className="flex-1 rounded-md bg-navy px-4 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-teal"
                  >
                    Book Consultation
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StarIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="text-navy"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}
