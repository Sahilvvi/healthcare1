import Link from "next/link";

export default function NotFoundPage() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center bg-warm-white px-6 text-center lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-widest text-teal">
        404
      </p>
      <h1 className="mt-4 max-w-2xl font-heading text-4xl font-semibold text-navy md:text-5xl">
        We couldn’t find that page
      </h1>
      <p className="mt-6 max-w-md text-muted">
        The page you are looking for may have moved or no longer exists. Let us
        guide you back to care.
      </p>
      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
        <Link
          href="/"
          className="rounded-md bg-navy px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-teal"
        >
          Return home
        </Link>
        <Link
          href="/treatment-plan"
          className="rounded-md border border-border bg-white px-6 py-3 text-sm font-medium text-dark transition-colors hover:border-navy hover:text-navy"
        >
          Explore treatments
        </Link>
      </div>
    </section>
  );
}
