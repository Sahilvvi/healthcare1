import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

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
    <section id="treatments" className="bg-warm-white bg-dot-pattern py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-14 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-teal">Explore specialties</p>
          <h2 className="mt-3 font-heading text-4xl font-semibold text-navy md:text-5xl">
            What are you looking for?
          </h2>
          <p className="mt-4 text-lg text-muted">
            Choose a specialty to explore trusted doctors, hospitals and all-inclusive treatment options.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, index) => (
            <Link
              key={category.slug}
              href={`/doctors?specialty=${encodeURIComponent(category.slug)}`}
              className={`group relative overflow-hidden rounded-2xl card-hover ${
                index === 0 ? "sm:col-span-2 sm:row-span-2" : ""
              }`}
            >
              <div className={`relative ${index === 0 ? "aspect-square sm:aspect-auto sm:h-full" : "aspect-[4/3]"}`}>
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/40 to-transparent transition-opacity duration-500 group-hover:opacity-90" />
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <div className="flex items-end justify-between">
                    <h3 className={`font-heading font-medium text-white ${index === 0 ? "text-3xl" : "text-xl"}`}>
                      {category.title}
                    </h3>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 translate-x-2">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                  <p className={`mt-2 text-white/80 ${index === 0 ? "block max-w-xs text-sm" : "hidden"}`}>
                    Find leading specialists, accredited hospitals and transparent packages.
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
