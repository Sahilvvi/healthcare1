import { withoutTitlePrefix } from "@/app/lib/doctorName";
import type { Case, Appointment, MedicineOrder, CaseTimeline, SupportTicket, Transaction, ActivityItem } from "@/app/lib/types";

export function buildActivityFeed(params: {
  cases?: Case[];
  appointments?: Appointment[];
  orders?: MedicineOrder[];
  timelines?: CaseTimeline[];
  tickets?: SupportTicket[];
  transactions?: Transaction[];
  routes?: Partial<Record<ActivityItem["type"], string>>;
}): ActivityItem[] {
  const items: ActivityItem[] = [];

  for (const c of params.cases || []) {
    items.push({
      id: c.id,
      type: "case",
      title: `New case submitted`,
      subtitle: `Status: ${c.status}`,
      created_at: c.created_at,
      href: params.routes?.case || "/admin/patients",
    });
  }

  for (const a of params.appointments || []) {
    items.push({
      id: a.id,
      type: "appointment",
      title: `Appointment scheduled`,
      subtitle: a.dv_doctors ? `Dr. ${withoutTitlePrefix(a.dv_doctors.name)} · ${a.type}` : a.type,
      created_at: a.scheduled_at || a.id,
      href: params.routes?.appointment || "/admin/appointments",
    });
  }

  for (const o of params.orders || []) {
    items.push({
      id: o.id,
      type: "order",
      title: `Medicine order ${o.status.toLowerCase()}`,
      subtitle: `Total ${o.total || "—"}`,
      created_at: o.created_at,
      href: params.routes?.order || "/admin/orders",
    });
  }

  for (const t of params.timelines || []) {
    items.push({
      id: t.id,
      type: "timeline",
      title: `Case updated to ${t.stage}`,
      subtitle: t.note || null,
      created_at: t.created_at,
      href: params.routes?.timeline || "/admin/patients",
    });
  }

  for (const t of params.tickets || []) {
    items.push({
      id: t.id,
      type: "ticket",
      title: `Support ticket: ${t.subject}`,
      subtitle: `${t.priority} · ${t.status}`,
      created_at: t.created_at,
      href: params.routes?.ticket || "/admin/support",
    });
  }

  for (const tx of params.transactions || []) {
    items.push({
      id: tx.id,
      type: "transaction",
      title: `${tx.type}: ${tx.currency} ${tx.amount}`,
      subtitle: tx.description || null,
      created_at: tx.created_at,
      href: params.routes?.transaction || "/admin/finance",
    });
  }

  return items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 20);
}
