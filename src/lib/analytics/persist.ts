import { getDb } from "@/db/client";
import { newId } from "@/db/ids";
import { analyticsEvents } from "@/db/schema";
import type { AnalyticsEventName, AnalyticsPayload } from "./track";

export async function persistAnalyticsEvent(args: {
  name: AnalyticsEventName | string;
  payload?: AnalyticsPayload;
  path?: string | null;
  sessionId?: string | null;
}): Promise<{ stored: boolean }> {
  const db = getDb();
  if (!db) return { stored: false };

  const cleanPayload: Record<string, string | number | boolean | null> = {};
  for (const [key, value] of Object.entries(args.payload ?? {})) {
    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean" ||
      value === null
    ) {
      cleanPayload[key] = value;
    } else if (value !== undefined) {
      cleanPayload[key] = String(value);
    }
  }

  try {
    await db.insert(analyticsEvents).values({
      id: newId("evt"),
      name: args.name,
      payload: cleanPayload,
      path: args.path ?? null,
      sessionId: args.sessionId ?? null,
    });
    return { stored: true };
  } catch (error) {
    console.warn("[analytics] persist failed", error);
    return { stored: false };
  }
}
