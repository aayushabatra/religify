CREATE TABLE IF NOT EXISTS "collections" (
  "id" text PRIMARY KEY NOT NULL,
  "slug" varchar(120) NOT NULL,
  "name" text NOT NULL,
  "nav_label" text NOT NULL,
  "description" text NOT NULL,
  "image_src" text NOT NULL,
  "image_alt" text NOT NULL,
  "image_is_sample_placeholder" boolean DEFAULT true NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "collections_slug_idx" ON "collections" USING btree ("slug");
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "products" (
  "id" text PRIMARY KEY NOT NULL,
  "slug" varchar(160) NOT NULL,
  "name" text NOT NULL,
  "subtitle" text NOT NULL,
  "short_description" text NOT NULL,
  "description" text NOT NULL,
  "collection_slug" varchar(120) NOT NULL,
  "images" jsonb NOT NULL,
  "price_in_paise" integer NOT NULL,
  "compare_at_price_in_paise" integer,
  "sku" varchar(80) NOT NULL,
  "stock_quantity" integer DEFAULT 0 NOT NULL,
  "is_active" boolean DEFAULT true NOT NULL,
  "is_featured" boolean DEFAULT false NOT NULL,
  "is_essential" boolean DEFAULT false NOT NULL,
  "materials_or_ingredients" text,
  "pack_contents" jsonb,
  "usage_notes" text,
  "care_and_safety" text,
  "seo_title" text NOT NULL,
  "seo_description" text NOT NULL,
  "is_sample_data" boolean DEFAULT true NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "products_slug_idx" ON "products" USING btree ("slug");
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "orders" (
  "id" text PRIMARY KEY NOT NULL,
  "status" varchar(40) DEFAULT 'pending' NOT NULL,
  "currency" varchar(3) DEFAULT 'INR' NOT NULL,
  "subtotal_in_paise" integer NOT NULL,
  "shipping_in_paise" integer DEFAULT 0 NOT NULL,
  "total_in_paise" integer NOT NULL,
  "customer_name" text NOT NULL,
  "customer_phone" text NOT NULL,
  "customer_email" text,
  "address_line" text NOT NULL,
  "pin_code" varchar(12) NOT NULL,
  "delivery_instructions" text,
  "razorpay_order_id" text,
  "paid_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "orders_razorpay_order_id_idx" ON "orders" USING btree ("razorpay_order_id");
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "order_items" (
  "id" text PRIMARY KEY NOT NULL,
  "order_id" text NOT NULL,
  "product_id" text NOT NULL,
  "product_slug" text NOT NULL,
  "product_name" text NOT NULL,
  "quantity" integer NOT NULL,
  "unit_price_in_paise" integer NOT NULL,
  "line_total_in_paise" integer NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payments" (
  "id" text PRIMARY KEY NOT NULL,
  "order_id" text NOT NULL,
  "provider" varchar(40) DEFAULT 'razorpay' NOT NULL,
  "status" varchar(40) DEFAULT 'created' NOT NULL,
  "amount_in_paise" integer NOT NULL,
  "currency" varchar(3) DEFAULT 'INR' NOT NULL,
  "razorpay_order_id" text,
  "razorpay_payment_id" text,
  "razorpay_signature" text,
  "raw_event" jsonb,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "payments_razorpay_payment_id_idx" ON "payments" USING btree ("razorpay_payment_id");
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "analytics_events" (
  "id" text PRIMARY KEY NOT NULL,
  "name" varchar(80) NOT NULL,
  "payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "path" text,
  "session_id" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "contact_submissions" (
  "id" text PRIMARY KEY NOT NULL,
  "kind" varchar(40) DEFAULT 'order_enquiry' NOT NULL,
  "name" text NOT NULL,
  "phone" text NOT NULL,
  "email" text,
  "address_line" text,
  "pin_code" varchar(12),
  "message" text,
  "cart_snapshot" jsonb,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payments" ADD CONSTRAINT "payments_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
