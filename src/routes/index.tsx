import {
	queryOptions,
	useMutation,
	useQuery,
} from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useState } from "react";
import MonthDonutChart from "#/components/MonthDonutChart";
import RecentExpensesList from "#/components/RecentExpensesList";
import { Button } from "#/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "#/components/ui/dialog";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import ViewSwitcher from "#/components/ViewSwitcher";
import YearBarChart from "#/components/YearBarChart";
import {
	getCategoryTotalsForMonth,
	getMonthlyTotalsByCategory,
} from "#/lib/mockData";
import type { CategoryInfo } from "#/lib/mockData";
import { fetchCategories } from "#/server/categories";
import {
	addExpense,
	fetchExpensesByMonth,
	fetchExpensesForYear,
} from "#/server/expenses";

const categoriesQueryOptions = queryOptions({
	queryKey: ["categories"],
	queryFn: () => fetchCategories(),
});

function yearExpensesQueryOptions(year: number) {
	return queryOptions({
		queryKey: ["expenses", "year", year],
		queryFn: () => fetchExpensesForYear({ data: { year } }),
	});
}

function monthExpensesQueryOptions(year: number, month: number) {
	return queryOptions({
		queryKey: ["expenses", "month", year, month],
		queryFn: () => fetchExpensesByMonth({ data: { year, month } }),
	});
}

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
	loader: ({ context }) =>
		Promise.all([
			context.queryClient.ensureQueryData(categoriesQueryOptions),
			context.queryClient.ensureQueryData(
				yearExpensesQueryOptions(new Date().getFullYear()),
			),
		]),
	component: Dashboard,
});

type ExpenseFormData = {
	description: string;
	amount: string;
	categoryId: number | "";
	date: string;
};

const today = new Date().toISOString().slice(0, 10);

function Dashboard() {
	const { view, year, month } = Route.useSearch();
	const navigate = useNavigate({ from: "/" });

	const { data: categoriesData = [] } = useQuery(categoriesQueryOptions);
	const { data: yearExpenses = [], refetch: refetchYear } = useQuery(
		yearExpensesQueryOptions(year),
	);
	const { data: monthExpenses = [], refetch: refetchMonth } = useQuery(
		monthExpensesQueryOptions(year, month),
	);

	const categoryList: CategoryInfo[] = categoriesData.map((c) => ({
		name: c.name,
		color: c.color,
	}));

	const monthlyTotals = getMonthlyTotalsByCategory(
		yearExpenses,
		year,
		categoryList,
	);
	const categoryTotals = getCategoryTotalsForMonth(
		monthExpenses,
		year,
		month,
	);
	const recentExpenses = [...monthExpenses]
		.sort((a, b) => b.date.localeCompare(a.date))
		.slice(0, 10);

	const [dialogOpen, setDialogOpen] = useState(false);
	const [formData, setFormData] = useState<ExpenseFormData>({
		description: "",
		amount: "",
		categoryId: "",
		date: today,
	});

	const addMutation = useMutation({
		mutationFn: (data: {
			description: string;
			amount: number;
			categoryId: number;
			date: string;
		}) => addExpense({ data }),
		onSuccess: () => {
			refetchYear();
			refetchMonth();
			closeDialog();
		},
	});

	function openDialog() {
		setFormData({
			description: "",
			amount: "",
			categoryId: categoriesData.length > 0 ? categoriesData[0].id : "",
			date: today,
		});
		setDialogOpen(true);
	}

	function closeDialog() {
		setDialogOpen(false);
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (
			!formData.description.trim() ||
			!formData.amount ||
			formData.categoryId === ""
		)
			return;

		addMutation.mutate({
			description: formData.description.trim(),
			amount: Number(formData.amount),
			categoryId: Number(formData.categoryId),
			date: formData.date,
		});
	}

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
			<div className="mb-6 flex items-center justify-between gap-4">
				<h1 className="text-2xl font-bold text-[var(--sea-ink)] sm:text-3xl">
					Home Budget
				</h1>
				<Button
					type="button"
					onClick={openDialog}
					className="inline-flex items-center gap-2 rounded-full bg-[var(--lagoon)] px-4 py-2 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(79,184,178,0.35)] transition hover:-translate-y-0.5 hover:bg-[var(--lagoon-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--lagoon)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)]"
					aria-label="Add new expense"
				>
					<Plus className="size-4" />
					New Expense
				</Button>
			</div>

			<ViewSwitcher
				view={view}
				year={year}
				month={month}
				onViewChange={handleViewChange}
				onMonthChange={handleMonthChange}
			/>

			<section className="island-shell rounded-2xl p-6 sm:p-8 mt-6">
				{view === "year" ? (
					<YearBarChart data={monthlyTotals} categoryList={categoryList} />
				) : (
					<MonthDonutChart data={categoryTotals} year={year} month={month} />
				)}
			</section>

			<section className="island-shell rounded-2xl p-6 sm:p-8 mt-6">
				<RecentExpensesList expenses={recentExpenses} />
				{view === "month" && monthExpenses.length > 0 && (
					<div className="mt-4 text-center">
						<Link
							to="/expenses"
							search={{ year, month }}
							className="text-sm font-medium text-[var(--lagoon)] hover:underline"
						>
							View all expenses
						</Link>
					</div>
				)}
			</section>

			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>New Expense</DialogTitle>
					</DialogHeader>
					<form onSubmit={handleSubmit} className="grid gap-4 pt-2">
						<div className="grid gap-2">
							<Label htmlFor="exp-desc">Description</Label>
							<Input
								id="exp-desc"
								value={formData.description}
								onChange={(e) =>
									setFormData((prev) => ({
										...prev,
										description: e.target.value,
									}))
								}
								placeholder="e.g. Groceries"
								required
								autoFocus
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="exp-amount">Amount (PLN)</Label>
							<Input
								id="exp-amount"
								type="number"
								step="0.01"
								min="0.01"
								value={formData.amount}
								onChange={(e) =>
									setFormData((prev) => ({
										...prev,
										amount: e.target.value,
									}))
								}
								placeholder="0.00"
								required
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="exp-cat">Category</Label>
							<select
								id="exp-cat"
								value={formData.categoryId}
								onChange={(e) =>
									setFormData((prev) => ({
										...prev,
										categoryId: Number(e.target.value),
									}))
								}
								required
								className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
							>
								<option value="" disabled>
									Select category
								</option>
								{categoriesData.map((cat) => (
									<option key={cat.id} value={cat.id}>
										{cat.name}
									</option>
								))}
							</select>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="exp-date">Date</Label>
							<Input
								id="exp-date"
								type="date"
								value={formData.date}
								onChange={(e) =>
									setFormData((prev) => ({
										...prev,
										date: e.target.value,
									}))
								}
								required
							/>
						</div>
						<div className="flex justify-end gap-2 pt-2">
							<Button type="button" variant="outline" onClick={closeDialog}>
								Cancel
							</Button>
							<Button
								type="submit"
								disabled={
									addMutation.isPending ||
									!formData.description.trim() ||
									!formData.amount ||
									formData.categoryId === ""
								}
								className="bg-[var(--lagoon)] text-white hover:bg-[var(--lagoon-deep)]"
							>
								{addMutation.isPending ? "Saving..." : "Create"}
							</Button>
						</div>
					</form>
				</DialogContent>
			</Dialog>
		</main>
	);
}
