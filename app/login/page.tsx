"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const roleRoutes: Record<string, string> = {
  patient: "/patient/dashboard",
  doctor: "/doctor/dashboard",
  admin: "/admin/dashboard",
};

const roles = [
  { key: "patient", label: "Patient" },
  { key: "doctor", label: "Doctor" },
  { key: "admin", label: "Admin" },
];

export default function LoginPage() {
  const [role, setRole] = useState("patient");
  const router = useRouter();

  return (
    <section className="bg-warm-white py-16 lg:py-24">
      <div className="mx-auto max-w-md px-6 lg:px-8">
        <div className="rounded-lg border border-border bg-white p-8 shadow-sm">
          <h1 className="font-heading text-2xl font-semibold text-navy">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-muted">
            Sign in to your Dadashri Vishwa Healthcare account.
          </p>

          <div className="mt-6 grid grid-cols-3 gap-2 rounded-md bg-sage/30 p-1">
            {roles.map((r) => (
              <button
                key={r.key}
                onClick={() => setRole(r.key)}
                className={`rounded-md py-2 text-sm font-medium transition-colors ${
                  role === r.key
                    ? "bg-white text-navy shadow-sm"
                    : "text-muted hover:text-dark"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              router.push(roleRoutes[role]);
            }}
          >
            <div>
              <label className="block text-sm font-medium text-dark">
                Email
              </label>
              <input
                type="email"
                className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-teal"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark">
                Password
              </label>
              <input
                type="password"
                className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-teal"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-md bg-navy py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal"
            >
              Sign in as {role.charAt(0).toUpperCase() + role.slice(1)}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            Don&apos;t have an account?{" "}
            <Link href="/treatment-plan" className="text-teal hover:text-navy">
              Start your treatment plan
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
