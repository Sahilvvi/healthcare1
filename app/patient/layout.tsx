import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import { Sidebar } from "@/app/components/Sidebar";
import { isPatient, roleDashboard } from "@/app/lib/roles";

export const metadata = {
  title: "Patient Dashboard | Dadashri Vishwa Healthcare",
};

export default async function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("dv_profiles")
    .select("name, role")
    .eq("id", user.id)
    .single();

  if (!isPatient(profile?.role)) {
    const dest = profile?.role ? roleDashboard(profile.role) : "/login";
    redirect(dest);
  }

  const nav = [
    {
      links: [
        { href: "/patient/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
        { href: "/patient/care-plan", label: "Care Plan", icon: "ClipboardList" },
        { href: "/patient/appointments", label: "Appointments", icon: "Calendar" },
      ],
    },
    {
      group: "Records",
      links: [
        { href: "/patient/medical-records", label: "Medical Records", icon: "FileText" },
        { href: "/patient/prescriptions", label: "Prescriptions", icon: "Pill" },
        { href: "/patient/medicines", label: "Medicines", icon: "Stethoscope" },
        { href: "/patient/travel", label: "Travel", icon: "Plane" },
        { href: "/patient/messages", label: "Messages", icon: "MessageSquare" },
      ],
    },
    {
      group: "Account",
      links: [
        { href: "/patient/billing", label: "Billing", icon: "CreditCard" },
        { href: "/patient/support", label: "Support", icon: "HeadphonesIcon" },
        { href: "/patient/settings", label: "Settings", icon: "Settings" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-warm-white lg:flex">
      <Sidebar
        items={nav}
        user={{ name: profile?.name || "Patient", role: profile?.role || "patient" }}
        roleLabel="Patient"
        homeHref="/patient/dashboard"
      />
      <main className="flex-1 px-4 pb-12 pt-20 lg:px-10 lg:py-12">{children}</main>
    </div>
  );
}
