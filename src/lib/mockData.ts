export type DbExpense = {
	id: number;
	description: string;
	amount: number;
	currency: string;
	date: string;
	categoryId: number;
	categoryName: string;
	categoryColor: string;
};

export type CategoryInfo = {
	name: string;
	color: string;
};

const MONTH_LABELS = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
];

export function getExpensesForMonth(
	expenses: DbExpense[],
	year: number,
	month: number,
): DbExpense[] {
	const prefix = `${year}-${String(month).padStart(2, "0")}`;
	return expenses.filter((e) => e.date.startsWith(prefix));
}

export function getMonthlyTotalsByCategory(
	expenses: DbExpense[],
	year: number,
	categoryList: CategoryInfo[],
): Record<string, number | string>[] {
	return MONTH_LABELS.map((label, idx) => {
		const month = idx + 1;
		const monthExpenses = getExpensesForMonth(expenses, year, month);
		const row: Record<string, number | string> = { month: label };
		for (const cat of categoryList) {
			row[cat.name] = monthExpenses
				.filter((e) => e.categoryName === cat.name)
				.reduce((sum, e) => sum + e.amount, 0);
		}
		return row;
	});
}

export function getCategoryTotalsForMonth(
	expenses: DbExpense[],
	year: number,
	month: number,
): { category: string; total: number; fill: string }[] {
	const monthExpenses = getExpensesForMonth(expenses, year, month);
	const categoryMap = new Map<string, { total: number; fill: string }>();

	for (const e of monthExpenses) {
		const existing = categoryMap.get(e.categoryName);
		if (existing) {
			existing.total += e.amount;
		} else {
			categoryMap.set(e.categoryName, {
				total: e.amount,
				fill: e.categoryColor,
			});
		}
	}

	return Array.from(categoryMap.entries())
		.map(([category, { total, fill }]) => ({ category, total, fill }))
		.filter((entry) => entry.total > 0);
}
