// ============================================================
// Expense Summary Query Script
// ============================================================
// This script queries the SQLite database for expenses in a
// given month and outputs structured JSON with summary stats.
//
// Usage:
//   npx tsx .claude/skills/expenses-summary/scripts/query-expenses.ts 2026-01
//
// IMPORTANT: Run from the project root so that:
//   1. The #/* path alias resolves (via package.json "imports")
//   2. The .env.local file is found by dotenv
//
// Output: JSON to stdout (pipe-friendly)
// ============================================================

// --- Step 1: Load environment variables ---
// In an ESM project ("type": "module" in package.json), static
// imports are hoisted — they run BEFORE any top-level code.
// This is a problem because src/db/index.ts reads DATABASE_URL
// at import time and throws if it's missing.
//
// Solution: load dotenv FIRST, then use dynamic import() for
// the database module. This ensures the env vars are available
// before the db singleton initializes.
//
// This pattern matches drizzle.config.ts in this project.
import { config } from "dotenv";
config({ path: [".env.local", ".env"] });

// --- Step 2: Parse and validate the CLI argument ---
const monthArg = process.argv[2];

if (!monthArg || !/^\d{4}-\d{2}$/.test(monthArg)) {
	console.error("Usage: npx tsx query-expenses.ts YYYY-MM");
	console.error("Example: npx tsx query-expenses.ts 2026-01");
	process.exit(1);
}

const [yearStr, monthStr] = monthArg.split("-");
const year = Number.parseInt(yearStr, 10);
const monthNum = Number.parseInt(monthStr, 10);

if (monthNum < 1 || monthNum > 12) {
	console.error("Month must be between 01 and 12");
	process.exit(1);
}

// Month names for human-readable output
const MONTH_NAMES = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];
const monthName = MONTH_NAMES[monthNum - 1];

// --- Step 3: Dynamically import database modules ---
// We use dynamic import() here (not static import) so that
// dotenv has already loaded DATABASE_URL into process.env
// before the db module tries to read it.
const { db } = await import("#/db/index");
const { expenses, categories } = await import("#/db/schema");
const { eq, and, gte, lt } = await import("drizzle-orm");

// --- Step 4: Query expenses with category join ---
// Date range filtering works via string comparison because
// dates are stored as "YYYY-MM-DD" text — lexicographic order
// matches chronological order for ISO date strings.
const startDate = `${yearStr}-${monthStr}-01`;

// Calculate the first day of the next month for the upper bound
const nextMonth = monthNum === 12 ? 1 : monthNum + 1;
const nextYear = monthNum === 12 ? year + 1 : year;
const endDate = `${nextYear}-${String(nextMonth).padStart(2, "0")}-01`;

// Drizzle select with LEFT JOIN to get category name and color
// alongside each expense. This is more explicit than using
// Drizzle's relational query API, making it clearer for teaching.
const rows = db
	.select({
		id: expenses.id,
		description: expenses.description,
		amount: expenses.amount,
		currency: expenses.currency,
		date: expenses.date,
		categoryName: categories.name,
		categoryColor: categories.color,
	})
	.from(expenses)
	.leftJoin(categories, eq(expenses.categoryId, categories.id))
	.where(and(gte(expenses.date, startDate), lt(expenses.date, endDate)))
	.orderBy(expenses.date)
	.all();

// --- Step 5: Compute summary statistics ---
// Even if there are no expenses, we output valid JSON with
// zeroed values so the template can still be filled.
const totalAmount = rows.reduce((sum, r) => sum + r.amount, 0);
const transactionCount = rows.length;
const averageAmount = transactionCount > 0 ? totalAmount / transactionCount : 0;

// Days in month (handles leap years correctly)
const daysInMonth = new Date(year, monthNum, 0).getDate();
const dailyAverage = totalAmount / daysInMonth;

// Highest and lowest expenses
const sorted = [...rows].sort((a, b) => b.amount - a.amount);
const highest = sorted[0] ?? null;
const lowest = sorted[sorted.length - 1] ?? null;

// --- Step 6: Category breakdown ---
// Group expenses by category, compute total and percentage
const categoryMap = new Map<
	string,
	{ total: number; count: number; color: string | null }
>();

for (const row of rows) {
	const name = row.categoryName ?? "Uncategorized";
	const existing = categoryMap.get(name) ?? {
		total: 0,
		count: 0,
		color: row.categoryColor,
	};
	existing.total += row.amount;
	existing.count += 1;
	categoryMap.set(name, existing);
}

// Sort categories by total (descending) for the report
const categoryBreakdown = [...categoryMap.entries()]
	.map(([name, data]) => ({
		name,
		total: data.total,
		percentage:
			totalAmount > 0
				? Number(((data.total / totalAmount) * 100).toFixed(1))
				: 0,
		count: data.count,
		color: data.color,
	}))
	.sort((a, b) => b.total - a.total);

// --- Step 7: Top 5 expenses ---
const topExpenses = sorted.slice(0, 5).map((row, index) => ({
	rank: index + 1,
	date: row.date,
	description: row.description,
	category: row.categoryName ?? "Uncategorized",
	amount: row.amount,
	currency: row.currency,
}));

// --- Step 8: Daily spending ---
// Build a map of day number -> total spending for that day.
// This powers the text-based bar chart in the report.
const dailySpending: Record<number, number> = {};
for (const row of rows) {
	const day = Number.parseInt(row.date.split("-")[2], 10);
	dailySpending[day] = (dailySpending[day] ?? 0) + row.amount;
}

// Count days that had at least one expense
const daysWithExpenses = Object.keys(dailySpending).length;

// Find the date range of actual expenses
const firstDate = rows.length > 0 ? rows[0].date : `${startDate}`;
const lastDate = rows.length > 0 ? rows[rows.length - 1].date : `${startDate}`;

// --- Step 9: Output structured JSON ---
// This JSON is consumed by Claude to fill the report template.
// All monetary values are raw numbers — formatting (e.g., adding
// thousands separators, currency symbol) happens at template time.
const output = {
	month: {
		year,
		monthNum,
		monthName,
		label: `${monthName} ${year}`,
	},
	currency: rows[0]?.currency ?? "PLN",
	summary: {
		totalAmount: Number(totalAmount.toFixed(2)),
		transactionCount,
		averageAmount: Number(averageAmount.toFixed(2)),
		dailyAverage: Number(dailyAverage.toFixed(2)),
		highest: highest
			? {
					amount: highest.amount,
					description: highest.description,
				}
			: null,
		lowest: lowest
			? {
					amount: lowest.amount,
					description: lowest.description,
				}
			: null,
	},
	categoryBreakdown,
	topExpenses,
	dailySpending,
	metadata: {
		daysInMonth,
		daysWithExpenses,
		firstDate,
		lastDate,
		generatedAt: new Date().toISOString().split("T")[0],
	},
};

console.log(JSON.stringify(output, null, 2));
