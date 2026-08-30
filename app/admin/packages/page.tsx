import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/app/lib/supabase/server";
import { supabaseAdmin } from "@/app/lib/supabase/admin";
import { SectionHeader } from "@/app/components/dashboard/SectionHeader";
import { isAdmin } from "@/app/lib/roles";
import type { Package } from "@/app/lib/types";
import { AddPackageForm } from "./AddPackageForm";

export default async function AdminPackagesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("dv_profiles").select("role").eq("id", user.id).single();
  if (!isAdmin(profile?.role)) redirect("/login");

  const { data: packagesData } = await supabaseAdmin.from("dv_packages").select("*").order("name");
  const packages: Package[] = (packagesData as Package[]) || [];

  return (
    <div className="space-y-8">
      <SectionHeader title="Packages" subtitle="Treatment packages and bundled pricing" />

      <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
        <h2 className="font-heading text-lg font-semibold text-navy">Add a package</h2>
        <AddPackageForm />
      </div>

      <div className="grid gap-4">
        {packages.map((pkg) => (
          <div key={pkg.id} className="flex flex-col justify-between gap-4 rounded-xl border border-border bg-white p-5 shadow-sm sm:flex-row sm:items-center">
            <div>
              <h3 className="font-heading font-semibold text-navy">{pkg.name}</h3>
              <p className="text-sm text-teal">{pkg.specialty}</p>
              <p className="text-sm text-muted">{pkg.price} · {pkg.stay}</p>
            </div>
            <Link href={`/packages/${pkg.slug}`} className="text-sm font-medium text-teal hover:text-navy">View package →</Link>
          </div>
        ))}
        {packages.length === 0 && <p className="text-muted">No packages found.</p>}
      </div>
    </div>
  );
}
