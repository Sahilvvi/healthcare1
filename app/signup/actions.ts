"use server";

import { supabaseAdmin } from "@/app/lib/supabase/admin";

export async function signUp(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const country = (formData.get("country") as string)?.trim();
  const city = (formData.get("city") as string)?.trim();

  if (!name || !email || !password || !country) {
    return { error: "Please fill in all required fields." };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match. Please re-enter them." };
  }

  const { data: userData, error: createError } =
    await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name, country, city },
    });

  if (createError || !userData.user) {
    if (createError?.code === "email_exists") {
      return { error: "An account with this email already exists. Please sign in." };
    }
    return { error: createError?.message ?? "Could not create account." };
  }

  const userId = userData.user.id;

  const { error: profileError } = await supabaseAdmin.from("dv_profiles").insert({
    id: userId,
    name,
    country,
    role: "patient",
  });

  if (profileError) {
    return { error: profileError.message };
  }

  return { ok: true, email, userId };
}
