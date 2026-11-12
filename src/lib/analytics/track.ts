/**
 * Thin analytics helper.
 * Client: GA4/dataLayer when configured + POST to /api/analytics/track for DB mirror.
 * Server: optional persist via persistAnalyticsEvent (callers should await that).
 * Never emit fake purchase events from the client alone.
 */

export type AnalyticsEventName =
  | "page_view"
  | "view_item_list"
  | "search"
  | "view_item"
  | "add_to_cart"
  | "remove_from_cart"
  | "view_cart"
  | "begin_checkout"
  | "purchase"
  | "contact_submit"
  | "whatsapp_click";

export type AnalyticsPayload = Record<
  string,
  string | number | boolean | null | undefined
>;

export type TrackArgs = {
  name: AnalyticsEventName;
  payload?: AnalyticsPayload;
};

export function track({ name, payload = {} }: TrackArgs): void {
  if (typeof window === "undefined") {
    if (process.env.NODE_ENV === "development") {
      console.info("[analytics:server]", name, payload);
    }
    return;
  }

  const detail = { name, payload, ts: Date.now() };

  if (process.env.NODE_ENV === "development") {
    console.info("[analytics]", detail);
  }

  window.dispatchEvent(new CustomEvent("narayan:analytics", { detail }));

  const w = window as Window & {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  };

  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (!measurementId && process.env.NODE_ENV === "development") {
    // GA4 stub when measurement id absent
    console.info("[analytics:ga4-stub]", name, payload);
  }

  if (Array.isArray(w.dataLayer)) {
    w.dataLayer.push({ event: name, ...payload });
  }

  if (typeof w.gtag === "function") {
    w.gtag("event", name, payload);
  }

  // Fire-and-forget DB mirror (no await — never block UI)
  void fetch("/api/analytics/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      payload,
      path: window.location.pathname,
    }),
    keepalive: true,
  }).catch(() => {
    /* ignore network errors for analytics */
  });
}
