import type { DbExpense } from "#/lib/mockData";

type RecentExpensesListProps = {
	expenses: DbExpense[];
};

export default function RecentExpensesList({
	expenses,
}: RecentExpensesListProps) {
	if (expenses.length === 0) {
		return (
			<p className="text-sm text-[var(--sea-ink-soft)]">
				No expenses this month.
			</p>
		);
	}

	return (
		<div>
			<h2 className="mb-4 text-base font-semibold text-[var(--sea-ink)]">
				Recent Expenses
			</h2>
			<div className="overflow-x-auto">
				<table className="w-full text-sm">
					<thead>
						<tr className="border-b border-[var(--line)] text-left text-xs font-semibold uppercase tracking-wide text-[var(--sea-ink-soft)]">
							<th className="pb-3 pr-4">Date</th>
							<th className="pb-3 pr-4">Description</th>
							<th className="pb-3 pr-4">Category</th>
							<th className="pb-3 text-right">Amount</th>
						</tr>
					</thead>
					<tbody>
						{expenses.map((expense) => (
							<tr
								key={expense.id}
								className="border-b border-[var(--line)] last:border-0"
							>
								<td className="py-3 pr-4 text-[var(--sea-ink-soft)]">
									{expense.date}
								</td>
								<td className="py-3 pr-4 text-[var(--sea-ink)]">
									{expense.description}
								</td>
								<td className="py-3 pr-4">
									<span className="inline-flex items-center gap-2">
										<span
											className="size-2.5 rounded-full shrink-0"
											style={{
												background: expense.categoryColor,
											}}
										/>
										<span className="text-[var(--sea-ink)]">
											{expense.categoryName}
										</span>
									</span>
								</td>
								<td className="py-3 text-right font-semibold text-[var(--sea-ink)]">
									{expense.amount} {expense.currency}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
