"use server";

import { supabaseAdmin } from "@/app/lib/supabase/admin";

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function addHospital(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const city = (formData.get("city") as string)?.trim();
  const country = (formData.get("country") as string)?.trim() || "India";
  const beds = (formData.get("beds") as string)?.trim();
  const about = (formData.get("about") as string)?.trim();
  const image = (formData.get("image") as string)?.trim() || "https://images.unsplash.com/photo-1587351021759-3e566b08af32?auto=format&fit=crop&q=80&w=800";

  if (!name || !city) {
    return { error: "Name and city are required." };
  }

  const slug = `${slugify(name)}-${Date.now()}`;

  const { error } = await supabaseAdmin.from("dv_hospitals").insert({
    slug,
    name,
    city,
    country,
    beds,
    about,
    image,
    accreditations: [],
    specialties: [],
    facilities: [],
  });

  if (error) {
    return { error: error.message };
  }

  return { ok: true };
}
