import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import type { Message } from "@/app/lib/types";
import { MessageForm } from "./MessageForm";

interface MessageWithSender extends Message {
  dv_profiles?: { name: string } | null;
}

export default async function PatientMessagesPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const { data: cases } = await supabase
    .from("dv_cases")
    .select("id")
    .eq("patient_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1);

  const activeCase = cases?.[0];

  let messages: MessageWithSender[] = [];
  if (activeCase) {
    const { data } = await supabase
      .from("dv_messages")
      .select("*, dv_profiles(name)")
      .eq("case_id", activeCase.id)
      .order("created_at", { ascending: true })
      .limit(100);
    messages = (data as MessageWithSender[]) || [];
  }

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
            {messages.length > 0 ? (
              messages.map((msg) => {
                const isMe = msg.sender_id === user.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                  >
                    <p className="text-xs text-muted">
                      {isMe ? "You" : msg.dv_profiles?.name || "Care team"} ·{" "}
                      {new Date(msg.created_at).toLocaleString()}
                    </p>
                    <p
                      className={`mt-1 max-w-md rounded-md px-4 py-2.5 text-sm ${
                        isMe
                          ? "bg-navy text-white"
                          : "bg-sage/40 text-dark"
                      }`}
                    >
                      {msg.content}
                    </p>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-muted">No messages yet.</p>
            )}
          </div>

          {activeCase ? (
            <MessageForm caseId={activeCase.id} />
          ) : (
            <p className="mt-6 text-sm text-muted">Submit a case to start messaging.</p>
          )}
        </div>
      </div>
    </section>
  );
}
