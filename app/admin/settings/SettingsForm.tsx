"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateSettings, type AdminSettings } from "./actions";

export function SettingsForm({ initial }: { initial: AdminSettings }) {
  const [settings, setSettings] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ ok?: boolean; error?: string } | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    const result = await updateSettings(new FormData(e.currentTarget));
    setLoading(false);
    setStatus(result);
    if (result.ok) {
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border border-border bg-white p-6 shadow-sm">
      {status?.error && <p className="text-sm text-red-600">{status.error}</p>}
      {status?.ok && <p className="text-sm text-teal">Settings saved.</p>}

      <div className="flex items-center justify-between border-b border-border pb-6">
        <div>
          <h2 className="font-heading font-semibold text-navy">Email notifications</h2>
          <p className="text-sm text-muted">Receive alerts for new patient cases and bookings</p>
        </div>
        <label className="relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full transition-colors" style={{ backgroundColor: settings.email_notifications ? "#0F766E" : "#DDEDE8" }}>
          <input
            type="checkbox"
            name="email_notifications"
            className="sr-only"
            checked={settings.email_notifications}
            onChange={(e) => setSettings((s) => ({ ...s, email_notifications: e.target.checked }))}
          />
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.email_notifications ? "translate-x-6" : "translate-x-1"}`} />
        </label>
      </div>

      <div className="flex items-center justify-between border-b border-border pb-6">
        <div>
          <h2 className="font-heading font-semibold text-navy">SMS alerts for urgent cases</h2>
          <p className="text-sm text-muted">Send SMS when a patient is marked urgent</p>
        </div>
        <label className="relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full transition-colors" style={{ backgroundColor: settings.sms_alerts ? "#0F766E" : "#DDEDE8" }}>
          <input
            type="checkbox"
            name="sms_alerts"
            className="sr-only"
            checked={settings.sms_alerts}
            onChange={(e) => setSettings((s) => ({ ...s, sms_alerts: e.target.checked }))}
          />
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.sms_alerts ? "translate-x-6" : "translate-x-1"}`} />
        </label>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading font-semibold text-navy">Default currency display</h2>
          <p className="text-sm text-muted">Show USD alongside INR in packages and invoices</p>
        </div>
        <select
          name="currency"
          defaultValue={settings.currency}
          className="rounded-md border border-border bg-warm-white px-3 py-2 text-sm text-dark outline-none focus:border-teal"
        >
          <option>USD + INR</option>
          <option>USD only</option>
          <option>INR only</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-navy px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save settings"}
      </button>
    </form>
  );
}
