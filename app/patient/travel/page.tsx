import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";

interface TravelEvent {
  id: string;
  title: string;
  detail: string | null;
  scheduled_at: string | null;
}

interface TravelItinerary {
  id: string;
  visa_docs: unknown;
  accommodation: string | null;
  coordinator_contact: string | null;
  dv_travel_events: TravelEvent[];
}

export default async function PatientTravelPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const { data: cases } = await supabase
    .from("dv_cases")
    .select("id")
    .eq("patient_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1);

  const activeCase = cases?.[0];

  let itinerary: TravelItinerary | null = null;
  if (activeCase) {
    const { data } = await supabase
      .from("dv_travel_itineraries")
      .select("*, dv_travel_events(*)")
      .eq("case_id", activeCase.id)
      .single();
    itinerary = (data as TravelItinerary) || null;
  }

  return (
    <section className="bg-warm-white py-10 lg:py-16">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <Link href="/patient/dashboard" className="text-sm text-muted hover:text-teal">
          ← Back to dashboard
        </Link>

        <h1 className="mt-6 font-heading text-3xl font-semibold text-navy">
          Your travel & stay
        </h1>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-lg border border-border bg-white p-6 shadow-sm">
            <h2 className="font-heading text-lg font-semibold text-navy">Visa & documents</h2>
            <ul className="mt-4 space-y-3 text-sm text-dark">
              {Array.isArray(itinerary?.visa_docs) && itinerary.visa_docs.length > 0 ? (
                (itinerary.visa_docs as string[]).map((doc) => (
                  <li key={doc} className="flex items-center justify-between">
                    <span>{doc}</span>
                    <span className="text-teal">Ready</span>
                  </li>
                ))
              ) : (
                <li className="text-muted">No travel documents recorded yet.</li>
              )}
            </ul>
          </div>

          <div className="rounded-lg border border-border bg-white p-6 shadow-sm">
            <h2 className="font-heading text-lg font-semibold text-navy">Accommodation</h2>
            <div className="mt-4 text-sm">
              <p className="font-medium text-dark">{itinerary?.accommodation || "Not booked yet"}</p>
              {!itinerary?.accommodation && (
                <p className="text-muted">Your coordinator will add accommodation details here.</p>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-white p-6 shadow-sm">
            <h2 className="font-heading text-lg font-semibold text-navy">Coordinator</h2>
            <div className="mt-4 text-sm">
              <p className="font-medium text-dark">{itinerary?.coordinator_contact || "Not assigned"}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-lg border border-border bg-white p-6 shadow-sm">
          <h2 className="font-heading text-lg font-semibold text-navy">Itinerary</h2>
          <div className="mt-6 space-y-0">
            {itinerary && itinerary.dv_travel_events && itinerary.dv_travel_events.length > 0 ? (
              itinerary.dv_travel_events.map((item, i, arr) => (
                <div key={item.id} className="relative flex gap-4 pb-8 last:pb-0">
                  <div className="flex flex-col items-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal text-xs font-semibold text-white">
                      {i + 1}
                    </div>
                    {i < arr.length - 1 && <div className="mt-2 h-full w-px bg-border" />}
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-teal">
                      {item.scheduled_at
                        ? new Date(item.scheduled_at).toLocaleDateString()
                        : "TBC"}
                    </p>
                    <h3 className="mt-1 font-heading font-semibold text-navy">{item.title}</h3>
                    <p className="text-sm text-muted">{item.detail || ""}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted">No itinerary events yet.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
