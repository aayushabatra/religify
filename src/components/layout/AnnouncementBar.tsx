import { storeConfig } from "@/config/store";

export function AnnouncementBar() {
  return (
    <div className="border-b border-gold/25 bg-forest text-ivory">
      <p className="mx-auto max-w-6xl px-4 py-2 text-center text-[11px] tracking-[0.08em] sm:text-xs">
        {storeConfig.announcement}
      </p>
    </div>
  );
}
