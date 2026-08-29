"use client";

export default function ContactPage() {
  return (
    <section className="bg-warm-white py-16 lg:py-24">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-teal">
              Contact
            </p>
            <h1 className="mt-3 font-heading text-3xl font-semibold text-navy md:text-4xl">
              We are here to help
            </h1>
            <p className="mt-4 text-muted">
              Have a question about treatment, travel or your case? Reach out
              and a care coordinator will respond within one business day.
            </p>

            <div className="mt-8 space-y-4 text-sm">
              <div>
                <p className="text-muted">Email</p>
                <p className="font-medium text-dark">care@dadashrihealth.com</p>
              </div>
              <div>
                <p className="text-muted">Phone</p>
                <p className="font-medium text-dark">+91 80 1234 5678</p>
              </div>
              <div>
                <p className="text-muted">Hours</p>
                <p className="font-medium text-dark">
                  Monday – Saturday, 9:00 AM – 7:00 PM IST
                </p>
              </div>
            </div>
          </div>

          <form
            className="rounded-lg border border-border bg-white p-6 lg:p-8"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark">
                  Name
                </label>
                <input
                  className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-teal"
                  placeholder="Your name"
                />
              </div>
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
                  Message
                </label>
                <textarea
                  rows={4}
                  className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-teal"
                  placeholder="How can we help you?"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-md bg-navy py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal"
              >
                Send message
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
