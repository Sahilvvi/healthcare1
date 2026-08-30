import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import { Sidebar } from "@/app/components/Sidebar";
import { isDoctor } from "@/app/lib/roles";
import {
  LayoutDashboard,
  Users,
  Calendar,
  ClipboardList,
  Pill,
  Video,
  Repeat,
  Banknote,
  BarChart3,
  HeadphonesIcon,
  Settings,
} from "lucide-react";

export const metadata = {
  title: "Doctor Workspace | Dadashri Vishwa Healthcare",
};

export default async function DoctorLayout({
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

  if (!isDoctor(profile?.role)) redirect("/login");

  const nav = [
    {
      links: [
        { href: "/doctor/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/doctor/patients", label: "Patients", icon: Users },
        { href: "/doctor/appointments", label: "Appointments", icon: Calendar },
      ],
    },
    {
      group: "Care",
      links: [
        { href: "/doctor/case-notes", label: "Case Notes", icon: ClipboardList },
        { href: "/doctor/prescriptions", label: "Prescriptions", icon: Pill },
        { href: "/doctor/teleconsultations", label: "Teleconsultations", icon: Video },
        { href: "/doctor/follow-ups", label: "Follow-ups", icon: Repeat },
      ],
    },
    {
      group: "Business",
      links: [
        { href: "/doctor/earnings", label: "Earnings", icon: Banknote },
        { href: "/doctor/reports", label: "Reports", icon: BarChart3 },
      ],
    },
    {
      group: "Account",
      links: [
        { href: "/doctor/support", label: "Support", icon: HeadphonesIcon },
        { href: "/doctor/settings", label: "Settings", icon: Settings },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-warm-white lg:flex">
      <Sidebar
        items={nav}
        user={{ name: profile?.name || "Doctor", role: profile?.role || "doctor" }}
        roleLabel="Doctor"
        homeHref="/doctor/dashboard"
      />
      <main className="flex-1 px-4 pb-12 pt-20 lg:px-10 lg:py-12">{children}</main>
    </div>
  );
}
