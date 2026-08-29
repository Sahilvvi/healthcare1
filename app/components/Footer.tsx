import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-navy py-14 text-white lg:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="font-heading text-xl font-semibold">
              Dadashri Vishwa Healthcare
            </Link>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70">
              A premium global healthcare and medical-travel platform connecting
              international patients with trusted doctors, hospitals and care
              coordinators in India.
            </p>
          </div>
          <div>
            <h4 className="font-heading text-sm font-semibold uppercase tracking-wider">
              Patients
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              <li>
                <Link href="/treatment-plan" className="hover:text-white">
                  Get Treatment Plan
                </Link>
              </li>
              <li>
                <Link href="/doctors" className="hover:text-white">
                  Find a Doctor
                </Link>
              </li>
              <li>
                <Link href="/packages" className="hover:text-white">
                  Treatment Packages
                </Link>
              </li>
              <li>
                <Link href="/patient/dashboard" className="hover:text-white">
                  Patient Portal
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading text-sm font-semibold uppercase tracking-wider">
              Company
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              <li>
                <Link href="/about" className="hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-white">
                  How it Works
                </Link>
              </li>
              <li>
                <Link href="/trust-safety" className="hover:text-white">
                  Trust & Safety
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-white/50 md:flex-row">
          <p>© 2026 Dadashri Vishwa Healthcare. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
