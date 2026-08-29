import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";

export default async function AdminSettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("dv_profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = (profile as { role?: string } | null)?.role;
  if (role !== "admin" && role !== "doctor") {
    redirect("/patient/dashboard");
  }

  return (
    <section>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-semibold text-navy">Settings</h1>
        <p className="text-sm text-muted">Platform preferences and notifications</p>
      </div>

      <div className="space-y-6 rounded-lg border border-border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-border pb-6">
          <div>
            <h2 className="font-heading font-semibold text-navy">Email notifications</h2>
            <p className="text-sm text-muted">Receive alerts for new patient cases and bookings</p>
          </div>
          <Toggle checked />
        </div>
        <div className="flex items-center justify-between border-b border-border pb-6">
          <div>
            <h2 className="font-heading font-semibold text-navy">SMS alerts for urgent cases</h2>
            <p className="text-sm text-muted">Send SMS when a patient is marked urgent</p>
          </div>
          <Toggle checked={false} />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading font-semibold text-navy">Default currency display</h2>
            <p className="text-sm text-muted">Show USD alongside INR in packages and invoices</p>
          </div>
          <select className="rounded-md border border-border bg-warm-white px-3 py-2 text-sm text-dark outline-none focus:border-teal">
            <option>USD + INR</option>
            <option>USD only</option>
            <option>INR only</option>
          </select>
        </div>
      </div>
    </section>
  );
}

function Toggle({ checked }: { checked: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? "bg-teal" : "bg-border"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}
