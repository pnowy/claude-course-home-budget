import { createServerFn } from "@tanstack/react-start";
import { eq, like } from "drizzle-orm";
import { z } from "zod";
import { db } from "#/db/index";
import { categories, expenses } from "#/db/schema";

export const fetchExpensesByMonth = createServerFn()
	.inputValidator(z.object({ year: z.number(), month: z.number() }))
	.handler(async ({ data }) => {
		const prefix = `${data.year}-${String(data.month).padStart(2, "0")}%`;
		return db
			.select({
				id: expenses.id,
				description: expenses.description,
				amount: expenses.amount,
				currency: expenses.currency,
				date: expenses.date,
				categoryId: expenses.categoryId,
				categoryName: categories.name,
				categoryColor: categories.color,
			})
			.from(expenses)
			.innerJoin(categories, eq(expenses.categoryId, categories.id))
			.where(like(expenses.date, prefix))
			.orderBy(expenses.date)
			.all();
	});

export const fetchExpensesForYear = createServerFn()
	.inputValidator(z.object({ year: z.number() }))
	.handler(async ({ data }) => {
		const prefix = `${data.year}-%`;
		return db
			.select({
				id: expenses.id,
				description: expenses.description,
				amount: expenses.amount,
				currency: expenses.currency,
				date: expenses.date,
				categoryId: expenses.categoryId,
				categoryName: categories.name,
				categoryColor: categories.color,
			})
			.from(expenses)
			.innerJoin(categories, eq(expenses.categoryId, categories.id))
			.where(like(expenses.date, prefix))
			.orderBy(expenses.date)
			.all();
	});

const addExpenseSchema = z.object({
	description: z.string().min(1),
	amount: z.number().positive(),
	categoryId: z.number(),
	date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const addExpense = createServerFn({ method: "POST" })
	.inputValidator(addExpenseSchema)
	.handler(async ({ data }) => {
		const results = db
			.insert(expenses)
			.values({
				description: data.description,
				amount: data.amount,
				categoryId: data.categoryId,
				date: data.date,
			})
			.returning()
			.all();
		return results[0];
	});

const updateExpenseSchema = z.object({
	id: z.number(),
	description: z.string().min(1),
	amount: z.number().positive(),
	categoryId: z.number(),
	date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const updateExpense = createServerFn({ method: "POST" })
	.inputValidator(updateExpenseSchema)
	.handler(async ({ data }) => {
		const results = db
			.update(expenses)
			.set({
				description: data.description,
				amount: data.amount,
				categoryId: data.categoryId,
				date: data.date,
			})
			.where(eq(expenses.id, data.id))
			.returning()
			.all();
		return results[0];
	});

const deleteExpenseSchema = z.object({
	id: z.number(),
});

export const deleteExpense = createServerFn({ method: "POST" })
	.inputValidator(deleteExpenseSchema)
	.handler(async ({ data }) => {
		db.delete(expenses).where(eq(expenses.id, data.id)).run();
		return { success: true };
	});
