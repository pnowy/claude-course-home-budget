import { createServerFn } from "@tanstack/react-start";
import { count, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "#/db/index";
import { categories, expenses } from "#/db/schema";

export const fetchCategories = createServerFn().handler(async () => {
	return db.select().from(categories).all();
});

const addCategorySchema = z.object({
	name: z.string().min(1),
	color: z.string().min(4),
});

export const addCategory = createServerFn({ method: "POST" })
	.inputValidator(addCategorySchema)
	.handler(async ({ data }) => {
		const results = db
			.insert(categories)
			.values({ name: data.name, color: data.color })
			.returning()
			.all();
		return results[0];
	});

const updateCategorySchema = z.object({
	id: z.number(),
	name: z.string().min(1),
	color: z.string().min(4),
});

export const updateCategory = createServerFn({ method: "POST" })
	.inputValidator(updateCategorySchema)
	.handler(async ({ data }) => {
		const results = db
			.update(categories)
			.set({ name: data.name, color: data.color })
			.where(eq(categories.id, data.id))
			.returning()
			.all();
		return results[0];
	});

const deleteCategorySchema = z.object({
	id: z.number(),
});

export const deleteCategory = createServerFn({ method: "POST" })
	.inputValidator(deleteCategorySchema)
	.handler(async ({ data }) => {
		const result = db
			.select({ count: count() })
			.from(expenses)
			.where(eq(expenses.categoryId, data.id))
			.get();

		if (result && result.count > 0) {
			throw new Error(
				`Cannot delete category: ${result.count} expense(s) are linked to it.`,
			);
		}

		db.delete(categories).where(eq(categories.id, data.id)).run();
		return { success: true };
	});
