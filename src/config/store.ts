/**
 * Hisar business facts — editable placeholders only.
 * Do not invent nationwide shipping, fulfilment, or contact details.
 * Replace values when the owner supplies verified information.
 */

export const storeConfig = {
  brand: {
    name: "NARAYAN",
    descriptor: "Rituals & Living",
    tagline: "Tradition, thoughtfully reimagined.",
    legacyName: "Narayan Poojan Bhandar",
    promise: "Making every ritual more thoughtful, beautiful, and accessible.",
  },
  announcement:
    "Thoughtfully curated essentials for everyday rituals. Sample catalogue for development.",
  location: {
    city: "Hisar",
    state: "Haryana",
    country: "India",
    /** Placeholder until owner supplies a verified address */
    addressLine: "Store address to be supplied — Hisar, Haryana",
    pinCode: "To be supplied",
  },
  contact: {
    phone: "Phone to be supplied",
    email: "Email to be supplied",
    whatsapp: "WhatsApp number to be supplied",
    hours: "Opening hours to be supplied",
  },
  social: {
    instagram: "",
  },
  shipping: {
    summary:
      "Shipping rates and serviceable areas to be confirmed. Currently rooted in Hisar, Haryana.",
  },
  currency: {
    code: "INR" as const,
    locale: "en-IN",
  },
  sampleDataNotice:
    "Sample development data — prices, stock, and imagery are placeholders, not production truth.",
} as const;

export type StoreConfig = typeof storeConfig;
