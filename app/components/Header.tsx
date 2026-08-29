import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-warm-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link href="/" className="font-heading text-xl font-semibold text-navy">
          Dadashri Vishwa Healthcare
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-dark md:flex">
          <Link href="#treatments" className="hover:text-teal transition-colors">
            Treatments
          </Link>
          <Link href="#journey" className="hover:text-teal transition-colors">
            Your Journey
          </Link>
          <Link href="#doctors" className="hover:text-teal transition-colors">
            Doctors
          </Link>
          <Link href="#packages" className="hover:text-teal transition-colors">
            Packages
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="#"
            className="hidden text-sm font-medium text-dark hover:text-navy sm:inline"
          >
            Log in
          </Link>
          <Link
            href="#packages"
            className="rounded-md bg-navy px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-teal"
          >
            Get Treatment Plan
          </Link>
        </div>
      </div>
    </header>
  );
}
