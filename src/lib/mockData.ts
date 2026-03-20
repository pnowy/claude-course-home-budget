export type Money = {
	amount: number;
	currency: string; // ISO 4217, e.g. "PLN", "EUR", "USD"
};

export type Category =
	| "Housing"
	| "Food"
	| "Transport"
	| "Health"
	| "Entertainment"
	| "Savings"
	| "Other";

export type Expense = {
	id: number;
	date: string; // "YYYY-MM-DD"
	description: string;
	money: Money;
	category: Category;
};

export const CATEGORIES: Category[] = [
	"Housing",
	"Food",
	"Transport",
	"Health",
	"Entertainment",
	"Savings",
	"Other",
];

export const CATEGORY_COLORS: Record<Category, string> = {
	Housing: "var(--chart-1)",
	Food: "var(--chart-2)",
	Transport: "var(--chart-3)",
	Health: "var(--chart-4)",
	Entertainment: "var(--chart-5)",
	Savings: "var(--lagoon)",
	Other: "var(--sea-ink-soft)",
};

export const MOCK_EXPENSES: Expense[] = [
	// January 2026
	{
		id: 1,
		date: "2026-01-03",
		description: "Rent",
		money: { amount: 2800, currency: "PLN" },
		category: "Housing",
	},
	{
		id: 2,
		date: "2026-01-05",
		description: "Groceries",
		money: { amount: 480, currency: "PLN" },
		category: "Food",
	},
	{
		id: 3,
		date: "2026-01-08",
		description: "Bus pass",
		money: { amount: 110, currency: "PLN" },
		category: "Transport",
	},
	{
		id: 4,
		date: "2026-01-12",
		description: "Gym membership",
		money: { amount: 150, currency: "PLN" },
		category: "Health",
	},
	{
		id: 5,
		date: "2026-01-18",
		description: "Netflix",
		money: { amount: 65, currency: "PLN" },
		category: "Entertainment",
	},
	{
		id: 6,
		date: "2026-01-28",
		description: "Savings transfer",
		money: { amount: 500, currency: "PLN" },
		category: "Savings",
	},
	// February 2026
	{
		id: 7,
		date: "2026-02-03",
		description: "Rent",
		money: { amount: 2800, currency: "PLN" },
		category: "Housing",
	},
	{
		id: 8,
		date: "2026-02-07",
		description: "Restaurant",
		money: { amount: 220, currency: "PLN" },
		category: "Food",
	},
	{
		id: 9,
		date: "2026-02-09",
		description: "Fuel",
		money: { amount: 180, currency: "PLN" },
		category: "Transport",
	},
	{
		id: 10,
		date: "2026-02-14",
		description: "Doctor visit",
		money: { amount: 200, currency: "PLN" },
		category: "Health",
	},
	{
		id: 11,
		date: "2026-02-20",
		description: "Cinema",
		money: { amount: 80, currency: "PLN" },
		category: "Entertainment",
	},
	{
		id: 12,
		date: "2026-02-25",
		description: "Savings transfer",
		money: { amount: 600, currency: "PLN" },
		category: "Savings",
	},
	// March 2026
	{
		id: 13,
		date: "2026-03-03",
		description: "Rent",
		money: { amount: 2800, currency: "PLN" },
		category: "Housing",
	},
	{
		id: 14,
		date: "2026-03-06",
		description: "Groceries",
		money: { amount: 520, currency: "PLN" },
		category: "Food",
	},
	{
		id: 15,
		date: "2026-03-10",
		description: "Taxi",
		money: { amount: 90, currency: "PLN" },
		category: "Transport",
	},
	{
		id: 16,
		date: "2026-03-15",
		description: "Pharmacy",
		money: { amount: 75, currency: "PLN" },
		category: "Health",
	},
	{
		id: 17,
		date: "2026-03-18",
		description: "Spotify",
		money: { amount: 23, currency: "PLN" },
		category: "Entertainment",
	},
	{
		id: 18,
		date: "2026-03-19",
		description: "Electricity bill",
		money: { amount: 210, currency: "PLN" },
		category: "Other",
	},
	// April 2026
	{
		id: 19,
		date: "2026-04-03",
		description: "Rent",
		money: { amount: 2800, currency: "PLN" },
		category: "Housing",
	},
	{
		id: 20,
		date: "2026-04-08",
		description: "Groceries",
		money: { amount: 460, currency: "PLN" },
		category: "Food",
	},
	{
		id: 21,
		date: "2026-04-12",
		description: "Train tickets",
		money: { amount: 140, currency: "PLN" },
		category: "Transport",
	},
	{
		id: 22,
		date: "2026-04-17",
		description: "Gym membership",
		money: { amount: 150, currency: "PLN" },
		category: "Health",
	},
	{
		id: 23,
		date: "2026-04-22",
		description: "Concert tickets",
		money: { amount: 180, currency: "PLN" },
		category: "Entertainment",
	},
	{
		id: 24,
		date: "2026-04-28",
		description: "Savings transfer",
		money: { amount: 700, currency: "PLN" },
		category: "Savings",
	},
	// May 2026
	{
		id: 25,
		date: "2026-05-03",
		description: "Rent",
		money: { amount: 2800, currency: "PLN" },
		category: "Housing",
	},
	{
		id: 26,
		date: "2026-05-09",
		description: "Restaurant",
		money: { amount: 310, currency: "PLN" },
		category: "Food",
	},
	{
		id: 27,
		date: "2026-05-14",
		description: "Fuel",
		money: { amount: 200, currency: "PLN" },
		category: "Transport",
	},
	{
		id: 28,
		date: "2026-05-20",
		description: "Dentist",
		money: { amount: 350, currency: "PLN" },
		category: "Health",
	},
	{
		id: 29,
		date: "2026-05-24",
		description: "Netflix",
		money: { amount: 65, currency: "PLN" },
		category: "Entertainment",
	},
	{
		id: 30,
		date: "2026-05-29",
		description: "Savings transfer",
		money: { amount: 500, currency: "PLN" },
		category: "Savings",
	},
	// June 2026
	{
		id: 31,
		date: "2026-06-03",
		description: "Rent",
		money: { amount: 2800, currency: "PLN" },
		category: "Housing",
	},
	{
		id: 32,
		date: "2026-06-10",
		description: "Groceries",
		money: { amount: 490, currency: "PLN" },
		category: "Food",
	},
	{
		id: 33,
		date: "2026-06-13",
		description: "Bus pass",
		money: { amount: 110, currency: "PLN" },
		category: "Transport",
	},
	{
		id: 34,
		date: "2026-06-18",
		description: "Gym membership",
		money: { amount: 150, currency: "PLN" },
		category: "Health",
	},
	{
		id: 35,
		date: "2026-06-22",
		description: "Summer festival",
		money: { amount: 250, currency: "PLN" },
		category: "Entertainment",
	},
	{
		id: 36,
		date: "2026-06-27",
		description: "Water bill",
		money: { amount: 95, currency: "PLN" },
		category: "Other",
	},
	// July 2026
	{
		id: 37,
		date: "2026-07-03",
		description: "Rent",
		money: { amount: 2800, currency: "PLN" },
		category: "Housing",
	},
	{
		id: 38,
		date: "2026-07-08",
		description: "Vacation food",
		money: { amount: 650, currency: "PLN" },
		category: "Food",
	},
	{
		id: 39,
		date: "2026-07-10",
		description: "Flight tickets",
		money: { amount: 890, currency: "PLN" },
		category: "Transport",
	},
	{
		id: 40,
		date: "2026-07-20",
		description: "Travel insurance",
		money: { amount: 120, currency: "PLN" },
		category: "Health",
	},
	{
		id: 41,
		date: "2026-07-25",
		description: "Shows & tours",
		money: { amount: 340, currency: "PLN" },
		category: "Entertainment",
	},
	{
		id: 42,
		date: "2026-07-29",
		description: "Savings transfer",
		money: { amount: 400, currency: "PLN" },
		category: "Savings",
	},
	// August 2026
	{
		id: 43,
		date: "2026-08-03",
		description: "Rent",
		money: { amount: 2800, currency: "PLN" },
		category: "Housing",
	},
	{
		id: 44,
		date: "2026-08-07",
		description: "Groceries",
		money: { amount: 430, currency: "PLN" },
		category: "Food",
	},
	{
		id: 45,
		date: "2026-08-12",
		description: "Fuel",
		money: { amount: 175, currency: "PLN" },
		category: "Transport",
	},
	{
		id: 46,
		date: "2026-08-19",
		description: "Gym membership",
		money: { amount: 150, currency: "PLN" },
		category: "Health",
	},
	{
		id: 47,
		date: "2026-08-23",
		description: "Netflix",
		money: { amount: 65, currency: "PLN" },
		category: "Entertainment",
	},
	{
		id: 48,
		date: "2026-08-28",
		description: "Savings transfer",
		money: { amount: 550, currency: "PLN" },
		category: "Savings",
	},
	// September 2026
	{
		id: 49,
		date: "2026-09-03",
		description: "Rent",
		money: { amount: 2800, currency: "PLN" },
		category: "Housing",
	},
	{
		id: 50,
		date: "2026-09-08",
		description: "Restaurant",
		money: { amount: 280, currency: "PLN" },
		category: "Food",
	},
	{
		id: 51,
		date: "2026-09-11",
		description: "Train tickets",
		money: { amount: 160, currency: "PLN" },
		category: "Transport",
	},
	{
		id: 52,
		date: "2026-09-17",
		description: "Dentist",
		money: { amount: 280, currency: "PLN" },
		category: "Health",
	},
	{
		id: 53,
		date: "2026-09-21",
		description: "Theater",
		money: { amount: 120, currency: "PLN" },
		category: "Entertainment",
	},
	{
		id: 54,
		date: "2026-09-26",
		description: "Savings transfer",
		money: { amount: 600, currency: "PLN" },
		category: "Savings",
	},
	// October 2026
	{
		id: 55,
		date: "2026-10-03",
		description: "Rent",
		money: { amount: 2800, currency: "PLN" },
		category: "Housing",
	},
	{
		id: 56,
		date: "2026-10-07",
		description: "Groceries",
		money: { amount: 510, currency: "PLN" },
		category: "Food",
	},
	{
		id: 57,
		date: "2026-10-10",
		description: "Bus pass",
		money: { amount: 110, currency: "PLN" },
		category: "Transport",
	},
	{
		id: 58,
		date: "2026-10-16",
		description: "Gym membership",
		money: { amount: 150, currency: "PLN" },
		category: "Health",
	},
	{
		id: 59,
		date: "2026-10-22",
		description: "Cinema",
		money: { amount: 70, currency: "PLN" },
		category: "Entertainment",
	},
	{
		id: 60,
		date: "2026-10-28",
		description: "Heating bill",
		money: { amount: 280, currency: "PLN" },
		category: "Other",
	},
	// November 2026
	{
		id: 61,
		date: "2026-11-03",
		description: "Rent",
		money: { amount: 2800, currency: "PLN" },
		category: "Housing",
	},
	{
		id: 62,
		date: "2026-11-08",
		description: "Restaurant",
		money: { amount: 350, currency: "PLN" },
		category: "Food",
	},
	{
		id: 63,
		date: "2026-11-13",
		description: "Fuel",
		money: { amount: 190, currency: "PLN" },
		category: "Transport",
	},
	{
		id: 64,
		date: "2026-11-19",
		description: "Doctor visit",
		money: { amount: 200, currency: "PLN" },
		category: "Health",
	},
	{
		id: 65,
		date: "2026-11-24",
		description: "Netflix",
		money: { amount: 65, currency: "PLN" },
		category: "Entertainment",
	},
	{
		id: 66,
		date: "2026-11-28",
		description: "Savings transfer",
		money: { amount: 650, currency: "PLN" },
		category: "Savings",
	},
	// December 2026
	{
		id: 67,
		date: "2026-12-03",
		description: "Rent",
		money: { amount: 2800, currency: "PLN" },
		category: "Housing",
	},
	{
		id: 68,
		date: "2026-12-10",
		description: "Christmas groceries",
		money: { amount: 820, currency: "PLN" },
		category: "Food",
	},
	{
		id: 69,
		date: "2026-12-14",
		description: "Train tickets",
		money: { amount: 200, currency: "PLN" },
		category: "Transport",
	},
	{
		id: 70,
		date: "2026-12-17",
		description: "Pharmacy",
		money: { amount: 95, currency: "PLN" },
		category: "Health",
	},
	{
		id: 71,
		date: "2026-12-22",
		description: "Gifts & entertainment",
		money: { amount: 480, currency: "PLN" },
		category: "Entertainment",
	},
	{
		id: 72,
		date: "2026-12-28",
		description: "Savings transfer",
		money: { amount: 300, currency: "PLN" },
		category: "Savings",
	},
];

export function getExpensesForMonth(
	expenses: Expense[],
	year: number,
	month: number,
): Expense[] {
	const prefix = `${year}-${String(month).padStart(2, "0")}`;
	return expenses.filter((e) => e.date.startsWith(prefix));
}

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

export function getMonthlyTotalsByCategory(
	expenses: Expense[],
	year: number,
): Record<string, number | string>[] {
	return MONTH_LABELS.map((label, idx) => {
		const month = idx + 1;
		const monthExpenses = getExpensesForMonth(expenses, year, month);
		const row: Record<string, number | string> = { month: label };
		for (const cat of CATEGORIES) {
			row[cat] = monthExpenses
				.filter((e) => e.category === cat)
				.reduce((sum, e) => sum + e.money.amount, 0);
		}
		return row;
	});
}

export function getCategoryTotalsForMonth(
	expenses: Expense[],
	year: number,
	month: number,
): { category: Category; total: number; fill: string }[] {
	const monthExpenses = getExpensesForMonth(expenses, year, month);
	return CATEGORIES.map((cat) => ({
		category: cat,
		total: monthExpenses
			.filter((e) => e.category === cat)
			.reduce((sum, e) => sum + e.money.amount, 0),
		fill: CATEGORY_COLORS[cat],
	})).filter((entry) => entry.total > 0);
}
