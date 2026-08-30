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

export async function addPackage(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const specialty = (formData.get("specialty") as string)?.trim();
  const price = (formData.get("price") as string)?.trim();
  const stay = (formData.get("stay") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();

  if (!name || !specialty || !price || !stay) {
    return { error: "Name, specialty, price and stay are required." };
  }

  const slug = `${slugify(name)}-${Date.now()}`;

  const { error } = await supabaseAdmin.from("dv_packages").insert({
    slug,
    name,
    specialty,
    price,
    stay,
    description,
    country: "India",
    includes: [],
    hospitals: [],
  });

  if (error) {
    return { error: error.message };
  }

  return { ok: true };
}
