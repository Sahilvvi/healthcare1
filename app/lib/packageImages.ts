export const packageImages: Record<string, string> = {
  "knee-replacement":
    "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=800",
  "cardiac-bypass":
    "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800",
  "liver-transplant":
    "https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&q=80&w=800",
  "spine-surgery":
    "https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&q=80&w=800",
  "ivf-fertility":
    "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=800",
  "dental-implants":
    "https://images.unsplash.com/photo-1606811841689-23dfddce3a95?auto=format&fit=crop&q=80&w=800",
};

const defaultImage =
  "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800";

export function getPackageImage(slug?: string | null): string {
  if (!slug) return defaultImage;
  return packageImages[slug] || defaultImage;
}
