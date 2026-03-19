import { drizzle } from "drizzle-orm/better-sqlite3";

import * as schema from "./schema.ts";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
	throw new Error("DATABASE_URL is required to initialize the database.");
}
export const db = drizzle(databaseUrl, { schema });
