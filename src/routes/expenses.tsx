import {
	queryOptions,
	useMutation,
	useQuery,
} from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "#/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "#/components/ui/dialog";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { cn } from "#/lib/utils";
import { fetchCategories } from "#/server/categories";
import {
	addExpense,
	deleteExpense,
	fetchExpensesByMonth,
	updateExpense,
} from "#/server/expenses";

const categoriesQueryOptions = queryOptions({
	queryKey: ["categories"],
	queryFn: () => fetchCategories(),
});

function monthExpensesQueryOptions(year: number, month: number) {
	return queryOptions({
		queryKey: ["expenses", "month", year, month],
		queryFn: () => fetchExpensesByMonth({ data: { year, month } }),
	});
}

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

export const Route = createFileRoute("/expenses")({
	validateSearch: (search: Record<string, unknown>) => ({
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
				monthExpensesQueryOptions(
					new Date().getFullYear(),
					new Date().getMonth() + 1,
				),
			),
		]),
	component: ExpensesPage,
});

type ExpenseFormData = {
	description: string;
	amount: string;
	categoryId: number | "";
	date: string;
};

function ExpensesPage() {
	const { year, month } = Route.useSearch();
	const navigate = useNavigate({ from: "/expenses" });

	const { data: categoriesData = [] } = useQuery(categoriesQueryOptions);
	const { data: expenses = [], refetch } = useQuery(
		monthExpensesQueryOptions(year, month),
	);

	const [dialogOpen, setDialogOpen] = useState(false);
	const [editingId, setEditingId] = useState<number | null>(null);
	const [formData, setFormData] = useState<ExpenseFormData>({
		description: "",
		amount: "",
		categoryId: "",
		date: new Date().toISOString().slice(0, 10),
	});
	const [error, setError] = useState<string | null>(null);

	const addMutation = useMutation({
		mutationFn: (data: {
			description: string;
			amount: number;
			categoryId: number;
			date: string;
		}) => addExpense({ data }),
		onSuccess: () => {
			refetch();
			closeDialog();
		},
	});

	const updateMutation = useMutation({
		mutationFn: (data: {
			id: number;
			description: string;
			amount: number;
			categoryId: number;
			date: string;
		}) => updateExpense({ data }),
		onSuccess: () => {
			refetch();
			closeDialog();
		},
	});

	const deleteMutation = useMutation({
		mutationFn: (id: number) => deleteExpense({ data: { id } }),
		onSuccess: () => {
			refetch();
		},
		onError: (err) => {
			setError(err.message);
		},
	});

	function openAddDialog() {
		setEditingId(null);
		setFormData({
			description: "",
			amount: "",
			categoryId: categoriesData.length > 0 ? categoriesData[0].id : "",
			date: new Date().toISOString().slice(0, 10),
		});
		setError(null);
		setDialogOpen(true);
	}

	function openEditDialog(exp: {
		id: number;
		description: string;
		amount: number;
		categoryId: number;
		date: string;
	}) {
		setEditingId(exp.id);
		setFormData({
			description: exp.description,
			amount: String(exp.amount),
			categoryId: exp.categoryId,
			date: exp.date,
		});
		setError(null);
		setDialogOpen(true);
	}

	function closeDialog() {
		setDialogOpen(false);
		setEditingId(null);
		setError(null);
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (
			!formData.description.trim() ||
			!formData.amount ||
			formData.categoryId === ""
		)
			return;

		const payload = {
			description: formData.description.trim(),
			amount: Number(formData.amount),
			categoryId: Number(formData.categoryId),
			date: formData.date,
		};

		if (editingId !== null) {
			updateMutation.mutate({ id: editingId, ...payload });
		} else {
			addMutation.mutate(payload);
		}
	}

	function handleMonthChange(direction: -1 | 1) {
		let newMonth = month + direction;
		let newYear = year;
		if (newMonth < 1) {
			newMonth = 12;
			newYear -= 1;
		} else if (newMonth > 12) {
			newMonth = 1;
			newYear += 1;
		}
		navigate({ search: { year: newYear, month: newMonth } });
	}

	const isSubmitting = addMutation.isPending || updateMutation.isPending;
	const total = expenses.reduce((sum, e) => sum + e.amount, 0);

	return (
		<main className="page-wrap px-4 pb-8 pt-10">
			<div className="mb-6 flex items-center justify-between gap-4">
				<h1 className="text-2xl font-bold text-[var(--sea-ink)] sm:text-3xl">
					Expenses
				</h1>
				<Button
					type="button"
					onClick={openAddDialog}
					className="inline-flex items-center gap-2 rounded-full bg-[var(--lagoon)] px-4 py-2 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(79,184,178,0.35)] transition hover:-translate-y-0.5 hover:bg-[var(--lagoon-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--lagoon)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)]"
				>
					<Plus className="size-4" />
					New Expense
				</Button>
			</div>

			<div className="mb-6 flex items-center justify-center gap-4">
				<button
					type="button"
					onClick={() => handleMonthChange(-1)}
					className="rounded-lg p-1.5 text-[var(--sea-ink-soft)] transition hover:bg-[var(--chip-bg)] hover:text-[var(--sea-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--lagoon)]"
					aria-label="Previous month"
				>
					<ChevronLeft className="size-5" />
				</button>
				<span className="min-w-[10rem] text-center text-lg font-semibold text-[var(--sea-ink)]">
					{MONTH_NAMES[month - 1]} {year}
				</span>
				<button
					type="button"
					onClick={() => handleMonthChange(1)}
					className="rounded-lg p-1.5 text-[var(--sea-ink-soft)] transition hover:bg-[var(--chip-bg)] hover:text-[var(--sea-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--lagoon)]"
					aria-label="Next month"
				>
					<ChevronRight className="size-5" />
				</button>
			</div>

			{error && (
				<div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
					{error}
					<button
						type="button"
						onClick={() => setError(null)}
						className="ml-2 font-semibold underline"
					>
						Dismiss
					</button>
				</div>
			)}

			<section className="island-shell rounded-2xl p-6 sm:p-8">
				{expenses.length === 0 ? (
					<p className="py-8 text-center text-sm text-[var(--sea-ink-soft)]">
						No expenses this month. Add one to get started.
					</p>
				) : (
					<>
						<div className="overflow-x-auto">
							<table className="w-full text-sm">
								<thead>
									<tr className="border-b border-[var(--line)] text-left text-xs font-semibold uppercase tracking-wide text-[var(--sea-ink-soft)]">
										<th className="pb-3 pr-4">Date</th>
										<th className="pb-3 pr-4">Description</th>
										<th className="pb-3 pr-4">Category</th>
										<th className="pb-3 pr-4 text-right">Amount</th>
										<th className="pb-3 text-right">Actions</th>
									</tr>
								</thead>
								<tbody>
									{expenses.map((exp) => (
										<tr
											key={exp.id}
											className="border-b border-[var(--line)] last:border-0"
										>
											<td className="py-3 pr-4 text-[var(--sea-ink-soft)]">
												{exp.date}
											</td>
											<td className="py-3 pr-4 text-[var(--sea-ink)]">
												{exp.description}
											</td>
											<td className="py-3 pr-4">
												<span className="inline-flex items-center gap-2">
													<span
														className="size-2.5 rounded-full shrink-0"
														style={{ background: exp.categoryColor }}
													/>
													<span className="text-[var(--sea-ink)]">
														{exp.categoryName}
													</span>
												</span>
											</td>
											<td className="py-3 pr-4 text-right font-semibold text-[var(--sea-ink)]">
												{exp.amount} {exp.currency}
											</td>
											<td className="py-3 text-right">
												<span className="inline-flex gap-1">
													<button
														type="button"
														onClick={() => openEditDialog(exp)}
														className="rounded-lg p-1.5 text-[var(--sea-ink-soft)] transition hover:bg-[var(--chip-bg)] hover:text-[var(--sea-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--lagoon)]"
														aria-label={`Edit ${exp.description}`}
													>
														<Pencil className="size-4" />
													</button>
													<button
														type="button"
														onClick={() => deleteMutation.mutate(exp.id)}
														disabled={deleteMutation.isPending}
														className={cn(
															"rounded-lg p-1.5 text-[var(--sea-ink-soft)] transition hover:bg-red-100 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:hover:bg-red-950 dark:hover:text-red-400",
															deleteMutation.isPending && "opacity-50",
														)}
														aria-label={`Delete ${exp.description}`}
													>
														<Trash2 className="size-4" />
													</button>
												</span>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
						<div className="mt-4 flex justify-end border-t border-[var(--line)] pt-4">
							<span className="text-sm font-semibold text-[var(--sea-ink)]">
								Total: {total.toFixed(2)} PLN
							</span>
						</div>
					</>
				)}
			</section>

			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>
							{editingId !== null ? "Edit Expense" : "New Expense"}
						</DialogTitle>
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
									isSubmitting ||
									!formData.description.trim() ||
									!formData.amount ||
									formData.categoryId === ""
								}
								className="bg-[var(--lagoon)] text-white hover:bg-[var(--lagoon-deep)]"
							>
								{isSubmitting
									? "Saving..."
									: editingId !== null
										? "Update"
										: "Create"}
							</Button>
						</div>
					</form>
				</DialogContent>
			</Dialog>
		</main>
	);
}
