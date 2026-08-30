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

export async function addDoctor(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const specialty = (formData.get("specialty") as string)?.trim();
  const experience = (formData.get("experience") as string)?.trim();
  const procedures = (formData.get("procedures") as string)?.trim();
  const availability = (formData.get("availability") as string)?.trim();
  const about = (formData.get("about") as string)?.trim();
  const image = (formData.get("image") as string)?.trim() || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=800";

  if (!name || !specialty) {
    return { error: "Name and specialty are required." };
  }

  const slug = `${slugify(name)}-${Date.now()}`;

  const { error } = await supabaseAdmin.from("dv_doctors").insert({
    slug,
    name,
    specialty,
    experience,
    procedures,
    availability,
    about,
    image,
    rating: 0,
    languages: [],
    qualifications: [],
    expertise: [],
    hospitals: [],
  });

  if (error) {
    return { error: error.message };
  }

  return { ok: true };
}

export async function deleteDoctor(id: string) {
  const { error } = await supabaseAdmin.from("dv_doctors").delete().eq("id", id);
  if (error) {
    return { error: error.message };
  }
  return { ok: true };
}
