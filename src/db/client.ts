import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

export type AppDatabase = PostgresJsDatabase<typeof schema>;

let cached: AppDatabase | null | undefined;
let sqlClient: ReturnType<typeof postgres> | null = null;

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL?.trim());
}

/**
 * Returns a Drizzle client when DATABASE_URL is set; otherwise null.
 * Never throws on missing URL so local `npm run dev` works offline.
 */
export function getDb(): AppDatabase | null {
  if (cached !== undefined) return cached;

  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    cached = null;
    return null;
  }

  sqlClient = postgres(url, {
    max: 5,
    idle_timeout: 20,
    prepare: false,
  });
  cached = drizzle(sqlClient, { schema });
  return cached;
}

export async function closeDb(): Promise<void> {
  if (sqlClient) {
    await sqlClient.end({ timeout: 5 });
    sqlClient = null;
  }
  cached = undefined;
}
