"use server";

import { createClient } from "@/app/lib/supabase/server";
import { supabaseAdmin } from "@/app/lib/supabase/admin";

export async function uploadDocument(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Not authenticated" };
  }

  const caseId = formData.get("caseId") as string;
  const label = (formData.get("label") as string)?.trim() || "Document";
  const file = formData.get("file") as File | null;

  if (!file || file.size === 0) {
    return { error: "Please select a file to upload." };
  }

  const extension = file.name.split(".").pop() || "pdf";
  const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${extension}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
    .from("documents")
    .upload(path, buffer, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });

  if (uploadError || !uploadData) {
    return { error: uploadError?.message ?? "Upload failed." };
  }

  const {
    data: { publicUrl },
  } = supabaseAdmin.storage.from("documents").getPublicUrl(uploadData.path);

  const { error: insertError } = await supabaseAdmin.from("dv_documents").insert({
    patient_id: user.id,
    case_id: caseId || null,
    label,
    url: publicUrl,
  });

  if (insertError) {
    return { error: insertError.message };
  }

  return { ok: true };
}
