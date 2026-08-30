import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import { SectionHeader } from "@/app/components/dashboard/SectionHeader";
import { EmptyState } from "@/app/components/dashboard/EmptyState";

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

function formatDate(ts: string | null) {
  if (!ts) return "TBC";
  return new Date(ts).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default async function PatientTravelPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: cases } = await supabase.from("dv_cases").select("id").eq("patient_id", user.id);
  const activeCase = (cases || [])[0];

  let itinerary: TravelItinerary | null = null;
  if (activeCase) {
    const { data } = await supabase
      .from("dv_travel_itineraries")
      .select("*, dv_travel_events(*)")
      .eq("case_id", activeCase.id)
      .single();
    itinerary = (data as TravelItinerary) || null;
  }

  const visaDocs = Array.isArray(itinerary?.visa_docs) ? (itinerary.visa_docs as string[]) : [];

  return (
    <div className="space-y-8">
      <SectionHeader title="Travel & stay" subtitle="Visa, accommodation, flights and local transport for your medical journey" />

      {!activeCase ? (
        <EmptyState title="No travel plan yet" subtitle="Your coordinator will add your travel details after the treatment plan is confirmed." />
      ) : (
        <>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
              <h2 className="font-heading text-lg font-semibold text-navy">Visa & documents</h2>
              <ul className="mt-4 space-y-3 text-sm">
                {visaDocs.length > 0 ? (
                  visaDocs.map((doc) => (
                    <li key={doc} className="flex items-center justify-between text-dark">
                      <span>{doc}</span>
                      <span className="text-teal">Ready</span>
                    </li>
                  ))
                ) : (
                  <li className="text-muted">No travel documents recorded yet.</li>
                )}
              </ul>
            </div>

            <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
              <h2 className="font-heading text-lg font-semibold text-navy">Accommodation</h2>
              <p className="mt-4 text-sm font-medium text-dark">{itinerary?.accommodation || "Not booked yet"}</p>
              {!itinerary?.accommodation && (
                <p className="mt-2 text-sm text-muted">Your coordinator will add accommodation details here.</p>
              )}
            </div>

            <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
              <h2 className="font-heading text-lg font-semibold text-navy">Coordinator</h2>
              <p className="mt-4 text-sm font-medium text-dark">{itinerary?.coordinator_contact || "Not assigned"}</p>
              <p className="mt-2 text-sm text-muted">Available 24/7 for travel and treatment assistance.</p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-xl border border-border bg-white p-6 shadow-sm lg:col-span-2">
              <h2 className="font-heading text-lg font-semibold text-navy">Itinerary</h2>
              {itinerary && itinerary.dv_travel_events && itinerary.dv_travel_events.length > 0 ? (
                <div className="mt-6 space-y-0">
                  {itinerary.dv_travel_events.map((item, i, arr) => (
                    <div key={item.id} className="relative flex gap-4 pb-8 last:pb-0">
                      <div className="flex flex-col items-center">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal text-xs font-semibold text-white">
                          {i + 1}
                        </div>
                        {i < arr.length - 1 && <div className="mt-2 h-full w-px bg-border" />}
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-teal">{formatDate(item.scheduled_at)}</p>
                        <h3 className="mt-1 font-heading font-semibold text-navy">{item.title}</h3>
                        <p className="text-sm text-muted">{item.detail || ""}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm text-muted">Your coordinator is preparing your itinerary. It will appear here once ready.</p>
              )}
            </div>

            <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
              <h2 className="font-heading text-lg font-semibold text-navy">Travel checklist</h2>
              <ul className="mt-4 list-disc space-y-2 pl-4 text-sm text-dark">
                <li>Valid passport and medical visa</li>
                <li>Confirmed hospital appointment letters</li>
                <li>Printed prescriptions and reports</li>
                <li>Travel insurance documents</li>
                <li>Emergency contact details</li>
              </ul>
              <Link href="/patient/support" className="mt-6 inline-block text-sm font-medium text-teal hover:text-navy">
                Contact support →
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
