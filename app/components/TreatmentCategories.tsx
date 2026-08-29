import Link from "next/link";

const categories = [
  { title: "Heart", slug: "cardiology", className: "from-navy to-[#1a3b5c]" },
  { title: "Cancer", slug: "cancer-care", className: "from-teal to-[#0d5f59]" },
  { title: "Bones & Joints", slug: "orthopedics", className: "from-[#9bb8b0] to-[#76948d]" },
  { title: "Neuro", slug: "neurology", className: "from-[#2a3f54] to-[#102A43]" },
  { title: "Transplant", slug: "transplants", className: "from-[#0d5f59] to-[#093d39]" },
  { title: "Women's Health", slug: "womens-health", className: "from-[#c5ddd6] to-[#9bb8b0]" },
  { title: "Dental", slug: "dental", className: "from-[#1a3b5c] to-navy" },
  { title: "Wellness", slug: "wellness", className: "from-[#0d5f59] to-teal" },
];

export function TreatmentCategories() {
  return (
    <section id="treatments" className="bg-warm-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-12 max-w-2xl">
          <h2 className="font-heading text-3xl font-semibold text-navy md:text-4xl">
            What are you looking for?
          </h2>
          <p className="mt-4 text-muted">
            Choose a specialty to explore trusted doctors, hospitals and
            all-inclusive treatment options.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href="/treatment-plan"
              className="group relative overflow-hidden rounded-md transition-all duration-300 hover:shadow-md"
            >
              <div
                className={`relative flex aspect-[4/3] items-end bg-gradient-to-br ${category.className} p-6 transition-transform duration-500 group-hover:scale-[1.02]`}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
                <h3 className="relative z-10 font-heading text-xl font-medium text-white">
                  {category.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
