"use client";

import Link from "next/link";

const messages = [
  {
    sender: "Care Coordinator",
    text: "Your visa invitation letter is ready for download.",
    time: "Today, 09:14 AM",
    me: false,
  },
  {
    sender: "You",
    text: "Thank you. Do I need to book the airport pickup myself?",
    time: "Today, 09:42 AM",
    me: true,
  },
  {
    sender: "Care Coordinator",
    text: "No, we have confirmed your pickup for 12 Sep at 06:30 AM. The driver will be at the arrivals gate.",
    time: "Today, 10:05 AM",
    me: false,
  },
];

export default function PatientMessagesPage() {
  return (
    <section className="bg-warm-white py-10 lg:py-16">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-3xl font-semibold text-navy md:text-4xl">
              Messages
            </h1>
            <p className="mt-2 text-muted">
              Direct line to your care coordinator and medical team.
            </p>
          </div>
          <Link
            href="/patient/dashboard"
            className="text-sm font-medium text-teal hover:text-navy"
          >
            Back to dashboard
          </Link>
        </div>

        <div className="rounded-lg border border-border bg-white p-6 shadow-sm">
          <div className="space-y-6">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col ${msg.me ? "items-end" : "items-start"}`}
              >
                <p className="text-xs text-muted">
                  {msg.sender} · {msg.time}
                </p>
                <p
                  className={`mt-1 max-w-md rounded-md px-4 py-2.5 text-sm ${
                    msg.me
                      ? "bg-navy text-white"
                      : "bg-sage/40 text-dark"
                  }`}
                >
                  {msg.text}
                </p>
              </div>
            ))}
          </div>

          <form
            className="mt-8 flex gap-3"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 rounded-md border border-border px-4 py-2.5 text-sm outline-none focus:border-teal"
            />
            <button
              type="submit"
              className="rounded-md bg-navy px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
