/**
 * Thin analytics stub for Phase A.
 * Later: forward to GA4 and optionally persist to analytics_events.
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
    // Server-safe no-op with structured log for local debugging
    if (process.env.NODE_ENV === "development") {
      console.info("[analytics:server]", name, payload);
    }
    return;
  }

  const detail = { name, payload, ts: Date.now() };

  // Dev console for verification; replace with gtag/dataLayer when GA4 is configured
  if (process.env.NODE_ENV === "development") {
    console.info("[analytics]", detail);
  }

  window.dispatchEvent(new CustomEvent("narayan:analytics", { detail }));

  const w = window as Window & {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  };

  if (Array.isArray(w.dataLayer)) {
    w.dataLayer.push({ event: name, ...payload });
  }

  if (typeof w.gtag === "function") {
    w.gtag("event", name, payload);
  }
}
