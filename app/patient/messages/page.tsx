import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import { SectionHeader } from "@/app/components/dashboard/SectionHeader";
import { Badge } from "@/app/components/dashboard/Badge";
import type { Message } from "@/app/lib/types";
import { MessageForm } from "./MessageForm";

interface CaseSummary {
  id: string;
  category: string | null;
  created_at: string;
}

type MessageWithSender = Message;

function formatDate(ts: string) {
  return new Date(ts).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
}

export default async function PatientMessagesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: cases } = await supabase
    .from("dv_cases")
    .select("id, category, created_at")
    .eq("patient_id", user.id)
    .order("created_at", { ascending: false });

  const activeCase: CaseSummary | undefined = (cases || [])[0] as CaseSummary | undefined;

  let messages: MessageWithSender[] = [];
  if (activeCase) {
    const { data } = await supabase
      .from("dv_messages")
      .select("*")
      .eq("case_id", activeCase.id)
      .order("created_at", { ascending: true })
      .limit(100);
    messages = (data as MessageWithSender[]) || [];
  }

  return (
    <div className="space-y-6">
      <SectionHeader title="Messages" subtitle="Direct line to your care coordinator and medical team" />

      {!activeCase ? (
        <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
          <p className="text-sm text-muted">Submit a case to start messaging your care team.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold text-navy">Case {activeCase.category}</h2>
            <Badge tone="info">{messages.length} messages</Badge>
          </div>

          <div className="space-y-5">
            {messages.length > 0 ? (
              messages.map((msg) => {
                const isMe = msg.sender_id === user.id;
                return (
                  <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                    <p className="text-xs text-muted">{isMe ? "You" : "Care team"} · {formatDate(msg.created_at)}</p>
                    <p className={`mt-1 max-w-md rounded-md px-4 py-2.5 text-sm ${isMe ? "bg-navy text-white" : "bg-sage/40 text-dark"}`}>
                      {msg.content}
                    </p>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-muted">No messages yet. Send a note to your coordinator.</p>
            )}
          </div>

          <MessageForm caseId={activeCase.id} />
        </div>
      )}
    </div>
  );
}
