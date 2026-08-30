import Link from "next/link";
import Image from "next/image";

const categories = [
  { title: "Heart", slug: "cardiology", image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800" },
  { title: "Cancer", slug: "cancer-care", image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800" },
  { title: "Bones & Joints", slug: "orthopedics", image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=800" },
  { title: "Neuro", slug: "neurology", image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&q=80&w=800" },
  { title: "Transplant", slug: "transplants", image: "https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&q=80&w=800" },
  { title: "Women's Health", slug: "womens-health", image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=800" },
  { title: "Dental", slug: "dental", image: "https://images.unsplash.com/photo-1606811841689-23dfddce3a95?auto=format&fit=crop&q=80&w=800" },
  { title: "Wellness", slug: "wellness", image: "https://images.unsplash.com/photo-1544367563-12123d8965cd?auto=format&fit=crop&q=80&w=800" },
];

export function TreatmentCategories() {
  return (
    <section id="treatments" className="bg-warm-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-12 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-teal">
            Explore specialties
          </p>
          <h2 className="mt-3 font-heading text-3xl font-semibold text-navy md:text-4xl">
            What are you looking for?
          </h2>
          <p className="mt-4 text-muted">
            Choose a specialty to explore trusted doctors, hospitals and
            all-inclusive treatment options.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href="/treatment-plan"
              className="group relative overflow-hidden rounded-2xl transition-all duration-500 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/30 to-transparent" />
                <div className="absolute inset-0 flex items-end p-6">
                  <h3 className="font-heading text-xl font-medium text-white">
                    {category.title}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
