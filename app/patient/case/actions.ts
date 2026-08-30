"use server";

import { createClient } from "@/app/lib/supabase/server";
import { supabaseAdmin } from "@/app/lib/supabase/admin";

export async function submitCase(formData: FormData) {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;
  const name = (formData.get("name") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim();
  const country = (formData.get("country") as string)?.trim();
  const city = (formData.get("city") as string)?.trim();
  const category = formData.get("category") as string;
  const condition = formData.get("condition") as string;
  const previousTreatment = (formData.get("previousTreatment") as string) || "";

  if (!category || !condition) {
    return { error: "Please select a category and describe your condition." };
  }

  const supabase = await createClient();
  const {
    data: { user: existingUser },
  } = await supabase.auth.getUser();

  let userId: string;
  let isNew = false;
  let finalEmail = email;
  let finalCountry = country;
  let finalCity = city;

  if (existingUser) {
    userId = existingUser.id;
    finalEmail = finalEmail || existingUser.email || "";

    const { data: profile } = await supabaseAdmin
      .from("dv_profiles")
      .select("name, country, phone")
      .eq("id", userId)
      .single();

    finalCountry = finalCountry || profile?.country || existingUser.user_metadata?.country || "";
    finalCity = finalCity || existingUser.user_metadata?.city || "";
  } else {
    if (!email || !password || !name || !country) {
      return { error: "Please fill in all required account details." };
    }

    const { data: userData, error: createError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { name, phone, country, city },
      });

    if (createError || !userData.user) {
      if (createError?.code === "email_exists") {
        return { error: "An account with this email already exists. Please sign in." };
      }
      return { error: createError?.message ?? "Could not create account." };
    }

    userId = userData.user.id;
    isNew = true;
    finalEmail = email;
    finalCountry = country;
    finalCity = city;

    const { error: profileError } = await supabaseAdmin.from("dv_profiles").insert({
      id: userId,
      name,
      phone,
      country,
      role: "patient",
    });

    if (profileError) {
      return { error: profileError.message };
    }
  }

  const { data: caseData, error: caseError } = await supabaseAdmin
    .from("dv_cases")
    .insert({
      patient_id: userId,
      category,
      condition,
      previous_treatment: previousTreatment || null,
      city: finalCity || null,
      country: finalCountry || null,
      status: "NEW",
    })
    .select()
    .single();

  if (caseError || !caseData) {
    return { error: caseError?.message ?? "Could not create case." };
  }

  const { error: timelineError } = await supabaseAdmin
    .from("dv_case_timeline")
    .insert({
      case_id: caseData.id,
      stage: "NEW",
      note: "Case submitted by patient.",
    });

  if (timelineError) {
    return { error: timelineError.message };
  }

  return { ok: true, email: finalEmail, isNew };
}
