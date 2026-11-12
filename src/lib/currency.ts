import { storeConfig } from "@/config/store";

/** Format integer paise as INR for display. */
export function formatInr(paise: number): string {
  const rupees = paise / 100;
  return new Intl.NumberFormat(storeConfig.currency.locale, {
    style: "currency",
    currency: storeConfig.currency.code,
    maximumFractionDigits: 0,
  }).format(rupees);
}
