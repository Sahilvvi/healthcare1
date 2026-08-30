import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import { supabaseAdmin } from "@/app/lib/supabase/admin";
import { SectionHeader } from "@/app/components/dashboard/SectionHeader";
import { Badge } from "@/app/components/dashboard/Badge";
import { isAdmin } from "@/app/lib/roles";
import type { Profile } from "@/app/lib/types";
import { RoleUpdate } from "./RoleUpdate";

export default async function AdminStaffPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("dv_profiles").select("role").eq("id", user.id).single();
  if (!isAdmin(profile?.role)) redirect("/login");

  const { data } = await supabaseAdmin.from("dv_profiles").select("id, name, role, country, created_at").order("created_at", { ascending: false });
  const staff: Profile[] = (data || []) as Profile[];

  return (
    <div className="space-y-6">
      <SectionHeader title="Staff" subtitle="Admins, doctors and support team accounts" />

      <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-warm-white text-muted">
            <tr>
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Country</th>
              <th className="px-5 py-3 font-medium">Role</th>
              <th className="px-5 py-3 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {staff.map((s) => (
              <tr key={s.id}>
                <td className="px-5 py-4 text-dark">{s.name || "—"}</td>
                <td className="px-5 py-4 text-muted">{s.country || "—"}</td>
                <td className="px-5 py-4"><Badge tone={s.role === "superadmin" ? "danger" : s.role === "admin" ? "info" : "success"}>{s.role}</Badge></td>
                <td className="px-5 py-4 text-muted">{new Date(s.created_at).toLocaleDateString("en-IN")}</td>
              </tr>
            ))}
            {staff.length === 0 && <tr><td className="px-5 py-4 text-muted" colSpan={4}>No staff accounts yet.</td></tr>}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
        <h2 className="font-heading text-lg font-semibold text-navy">Change user role</h2>
        <RoleUpdate users={staff} />
      </div>
    </div>
  );
}
