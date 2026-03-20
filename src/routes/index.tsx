import { createFileRoute, useNavigate } from "@tanstack/react-router";
import MonthDonutChart from "#/components/MonthDonutChart";
import RecentExpensesList from "#/components/RecentExpensesList";
import ViewSwitcher from "#/components/ViewSwitcher";
import YearBarChart from "#/components/YearBarChart";
import {
	getCategoryTotalsForMonth,
	getExpensesForMonth,
	getMonthlyTotalsByCategory,
	MOCK_EXPENSES,
} from "#/lib/mockData";

export const Route = createFileRoute("/")({
	validateSearch: (search: Record<string, unknown>) => ({
		view: (search.view === "year" ? "year" : "month") as "year" | "month",
		year:
			typeof search.year === "number" ? search.year : new Date().getFullYear(),
		month:
			typeof search.month === "number"
				? search.month
				: new Date().getMonth() + 1,
	}),
	component: Dashboard,
});

function Dashboard() {
	const { view, year, month } = Route.useSearch();
	const navigate = useNavigate({ from: "/" });

	const monthlyTotals = getMonthlyTotalsByCategory(MOCK_EXPENSES, year);
	const categoryTotals = getCategoryTotalsForMonth(MOCK_EXPENSES, year, month);
	const recentExpenses = getExpensesForMonth(MOCK_EXPENSES, year, month)
		.sort((a, b) => b.date.localeCompare(a.date))
		.slice(0, 10);

	function handleViewChange(newView: "year" | "month") {
		navigate({ search: (prev) => ({ ...prev, view: newView }) });
	}

	function handleMonthChange(newYear: number, newMonth: number) {
		navigate({
			search: (prev) => ({ ...prev, year: newYear, month: newMonth }),
		});
	}

	return (
		<main className="page-wrap px-4 pb-8 pt-10">
			<h1 className="mb-6 text-2xl font-bold text-[var(--sea-ink)] sm:text-3xl">
				Home Budget
			</h1>

			<ViewSwitcher
				view={view}
				year={year}
				month={month}
				onViewChange={handleViewChange}
				onMonthChange={handleMonthChange}
			/>

			<section className="island-shell rounded-2xl p-6 sm:p-8 mt-6">
				{view === "year" ? (
					<YearBarChart data={monthlyTotals} />
				) : (
					<MonthDonutChart data={categoryTotals} year={year} month={month} />
				)}
			</section>

			<section className="island-shell rounded-2xl p-6 sm:p-8 mt-6">
				<RecentExpensesList expenses={recentExpenses} />
			</section>
		</main>
	);
}
