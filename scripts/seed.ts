import { createClient } from "@supabase/supabase-js";
import { WebSocketCtor } from "@/app/lib/supabase/ws";
import { doctors } from "@/app/lib/doctors";
import { hospitals } from "@/app/lib/hospitals";
import { packages } from "@/app/lib/packages";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
  realtime: { transport: WebSocketCtor },
});

async function seed() {
  const doctorRows = doctors.map((d) => ({
    slug: d.slug,
    name: d.name,
    specialty: d.specialty,
    experience: d.experience,
    rating: parseFloat(d.rating),
    procedures: d.procedures,
    languages: d.languages,
    qualifications: d.qualifications,
    expertise: d.expertise,
    about: d.about,
    availability: d.availability,
    hospitals: d.hospitals,
    image: d.image,
  }));

  const { error: dErr } = await supabase
    .from("dv_doctors")
    .upsert(doctorRows, { onConflict: "slug" });
  if (dErr) throw dErr;
  console.log(`Seeded ${doctorRows.length} doctors`);

  const { error: hErr } = await supabase
    .from("dv_hospitals")
    .upsert(hospitals, { onConflict: "slug" });
  if (hErr) throw hErr;
  console.log(`Seeded ${hospitals.length} hospitals`);

  const { error: pErr } = await supabase
    .from("dv_packages")
    .upsert(packages, { onConflict: "slug" });
  if (pErr) throw pErr;
  console.log(`Seeded ${packages.length} packages`);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
