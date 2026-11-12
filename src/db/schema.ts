import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

/** Money columns are integer paise. */

export const collections = pgTable(
  "collections",
  {
    id: text("id").primaryKey(),
    slug: varchar("slug", { length: 120 }).notNull(),
    name: text("name").notNull(),
    navLabel: text("nav_label").notNull(),
    description: text("description").notNull(),
    imageSrc: text("image_src").notNull(),
    imageAlt: text("image_alt").notNull(),
    imageIsSamplePlaceholder: boolean("image_is_sample_placeholder")
      .notNull()
      .default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [uniqueIndex("collections_slug_idx").on(table.slug)],
);

export const products = pgTable(
  "products",
  {
    id: text("id").primaryKey(),
    slug: varchar("slug", { length: 160 }).notNull(),
    name: text("name").notNull(),
    subtitle: text("subtitle").notNull(),
    shortDescription: text("short_description").notNull(),
    description: text("description").notNull(),
    collectionSlug: varchar("collection_slug", { length: 120 }).notNull(),
    images: jsonb("images")
      .$type<
        Array<{
          src: string;
          alt: string;
          isSamplePlaceholder: boolean;
        }>
      >()
      .notNull(),
    priceInPaise: integer("price_in_paise").notNull(),
    compareAtPriceInPaise: integer("compare_at_price_in_paise"),
    sku: varchar("sku", { length: 80 }).notNull(),
    stockQuantity: integer("stock_quantity").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    isFeatured: boolean("is_featured").notNull().default(false),
    isEssential: boolean("is_essential").notNull().default(false),
    materialsOrIngredients: text("materials_or_ingredients"),
    packContents: jsonb("pack_contents").$type<string[] | null>(),
    usageNotes: text("usage_notes"),
    careAndSafety: text("care_and_safety"),
    seoTitle: text("seo_title").notNull(),
    seoDescription: text("seo_description").notNull(),
    isSampleData: boolean("is_sample_data").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [uniqueIndex("products_slug_idx").on(table.slug)],
);

export const orders = pgTable(
  "orders",
  {
    id: text("id").primaryKey(),
    status: varchar("status", { length: 40 }).notNull().default("pending"),
    currency: varchar("currency", { length: 3 }).notNull().default("INR"),
    subtotalInPaise: integer("subtotal_in_paise").notNull(),
    shippingInPaise: integer("shipping_in_paise").notNull().default(0),
    totalInPaise: integer("total_in_paise").notNull(),
    customerName: text("customer_name").notNull(),
    customerPhone: text("customer_phone").notNull(),
    customerEmail: text("customer_email"),
    addressLine: text("address_line").notNull(),
    pinCode: varchar("pin_code", { length: 12 }).notNull(),
    deliveryInstructions: text("delivery_instructions"),
    razorpayOrderId: text("razorpay_order_id"),
    paidAt: timestamp("paid_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("orders_razorpay_order_id_idx").on(table.razorpayOrderId),
  ],
);

export const orderItems = pgTable("order_items", {
  id: text("id").primaryKey(),
  orderId: text("order_id")
    .notNull()
    .references(() => orders.id),
  productId: text("product_id").notNull(),
  productSlug: text("product_slug").notNull(),
  productName: text("product_name").notNull(),
  quantity: integer("quantity").notNull(),
  unitPriceInPaise: integer("unit_price_in_paise").notNull(),
  lineTotalInPaise: integer("line_total_in_paise").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const payments = pgTable(
  "payments",
  {
    id: text("id").primaryKey(),
    orderId: text("order_id")
      .notNull()
      .references(() => orders.id),
    provider: varchar("provider", { length: 40 }).notNull().default("razorpay"),
    status: varchar("status", { length: 40 }).notNull().default("created"),
    amountInPaise: integer("amount_in_paise").notNull(),
    currency: varchar("currency", { length: 3 }).notNull().default("INR"),
    razorpayOrderId: text("razorpay_order_id"),
    razorpayPaymentId: text("razorpay_payment_id"),
    razorpaySignature: text("razorpay_signature"),
    rawEvent: jsonb("raw_event").$type<Record<string, unknown> | null>(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("payments_razorpay_payment_id_idx").on(table.razorpayPaymentId),
  ],
);

export const analyticsEvents = pgTable("analytics_events", {
  id: text("id").primaryKey(),
  name: varchar("name", { length: 80 }).notNull(),
  payload: jsonb("payload")
    .$type<Record<string, string | number | boolean | null>>()
    .notNull()
    .default({}),
  path: text("path"),
  sessionId: text("session_id"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const contactSubmissions = pgTable("contact_submissions", {
  id: text("id").primaryKey(),
  kind: varchar("kind", { length: 40 }).notNull().default("order_enquiry"),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  addressLine: text("address_line"),
  pinCode: varchar("pin_code", { length: 12 }),
  message: text("message"),
  cartSnapshot: jsonb("cart_snapshot").$type<Record<string, unknown> | null>(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
