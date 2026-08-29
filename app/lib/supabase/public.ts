import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { WebSocketCtor } from "./ws";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

export const supabasePublic = createSupabaseClient(url, anonKey, {
  auth: { autoRefreshToken: false, persistSession: false },
  realtime: { transport: WebSocketCtor },
});
