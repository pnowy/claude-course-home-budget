import { sql } from "drizzle-orm";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const categories = sqliteTable("categories", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	name: text("name").notNull(),
	color: text("color").notNull(),
	icon: text("icon"),
	createdAt: integer("created_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
});

export const expenses = sqliteTable("expenses", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	description: text("description").notNull(),
	amount: real("amount").notNull(),
	currency: text("currency").notNull().default("PLN"),
	date: text("date").notNull(),
	categoryId: integer("category_id")
		.notNull()
		.references(() => categories.id),
	createdAt: integer("created_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
});
