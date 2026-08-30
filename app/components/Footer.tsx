"use client";

import Link from "next/link";
import { Mail, Phone, Clock, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-navy py-16 text-white lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <Link href="/" className="font-heading text-2xl font-semibold">
              Dadashri Vishwa Healthcare
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/70">
              A premium global healthcare and medical-travel platform connecting international patients with trusted doctors, hospitals and care coordinators in India.
            </p>
            <div className="mt-6 space-y-3 text-sm text-white/70">
              <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-teal" /> care@dadashrihealth.com</p>
              <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-teal" /> +91 80 1234 5678</p>
              <p className="flex items-center gap-2"><Clock className="h-4 w-4 text-teal" /> Mon – Sat, 9:00 AM – 7:00 PM IST</p>
              <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-teal" /> Bengaluru, India</p>
            </div>
          </div>
          <div>
            <h4 className="font-heading text-sm font-semibold uppercase tracking-wider text-white/90">Patients</h4>
            <ul className="mt-5 space-y-3 text-sm text-white/70">
              <li><Link href="/treatment-plan" className="transition-colors hover:text-white">Get Treatment Plan</Link></li>
              <li><Link href="/doctors" className="transition-colors hover:text-white">Find a Doctor</Link></li>
              <li><Link href="/packages" className="transition-colors hover:text-white">Treatment Packages</Link></li>
              <li><Link href="/hospitals" className="transition-colors hover:text-white">Hospitals</Link></li>
              <li><Link href="/patient/dashboard" className="transition-colors hover:text-white">Patient Portal</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading text-sm font-semibold uppercase tracking-wider text-white/90">Company</h4>
            <ul className="mt-5 space-y-3 text-sm text-white/70">
              <li><Link href="/about" className="transition-colors hover:text-white">About Us</Link></li>
              <li><Link href="/how-it-works" className="transition-colors hover:text-white">How it Works</Link></li>
              <li><Link href="/stories" className="transition-colors hover:text-white">Patient Stories</Link></li>
              <li><Link href="/trust-safety" className="transition-colors hover:text-white">Trust & Safety</Link></li>
              <li><Link href="/contact" className="transition-colors hover:text-white">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading text-sm font-semibold uppercase tracking-wider text-white/90">For Providers</h4>
            <ul className="mt-5 space-y-3 text-sm text-white/70">
              <li><Link href="/doctor/dashboard" className="transition-colors hover:text-white">Doctor Portal</Link></li>
              <li><Link href="/admin/dashboard" className="transition-colors hover:text-white">Admin Panel</Link></li>
            </ul>
          </div>
          <div className="lg:col-span-1">
            <h4 className="font-heading text-sm font-semibold uppercase tracking-wider text-white/90">Stay updated</h4>
            <p className="mt-5 text-sm text-white/70">Get medical travel guides and health tips.</p>
            <form className="mt-4 flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none focus:border-teal focus:ring-1 focus:ring-teal"
              />
              <button type="submit" className="rounded-lg bg-teal px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal/90">
                Join
              </button>
            </form>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-white/50 md:flex-row">
          <p>© 2026 Dadashri Vishwa Healthcare. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="transition-colors hover:text-white">Privacy</Link>
            <Link href="/terms" className="transition-colors hover:text-white">Terms</Link>
            <Link href="/sitemap.xml" className="transition-colors hover:text-white">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
