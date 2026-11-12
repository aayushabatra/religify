import { NextResponse } from "next/server";
import { persistAnalyticsEvent } from "@/lib/analytics/persist";
import type { AnalyticsEventName } from "@/lib/analytics/track";

const ALLOWED: AnalyticsEventName[] = [
  "page_view",
  "view_item_list",
  "search",
  "view_item",
  "add_to_cart",
  "remove_from_cart",
  "view_cart",
  "begin_checkout",
  "contact_submit",
  "whatsapp_click",
  // purchase intentionally omitted from client-accepted list
];

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const record = body as {
    name?: string;
    payload?: Record<string, string | number | boolean | null | undefined>;
    path?: string;
    sessionId?: string;
  };

  if (!record.name || !ALLOWED.includes(record.name as AnalyticsEventName)) {
    return NextResponse.json(
      { ok: false, error: "Event not allowed from client" },
      { status: 400 },
    );
  }

  // Never accept client-reported purchase as truth
  if (record.name === "purchase") {
    return NextResponse.json(
      { ok: false, error: "purchase must be server-confirmed" },
      { status: 400 },
    );
  }

  const result = await persistAnalyticsEvent({
    name: record.name as AnalyticsEventName,
    payload: record.payload,
    path: record.path,
    sessionId: record.sessionId,
  });

  return NextResponse.json({ ok: true, ...result });
}
