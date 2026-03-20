import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "#/lib/utils";

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

type ViewSwitcherProps = {
	view: "year" | "month";
	year: number;
	month: number;
	onViewChange: (view: "year" | "month") => void;
	onMonthChange: (year: number, month: number) => void;
};

export default function ViewSwitcher({
	view,
	year,
	month,
	onViewChange,
	onMonthChange,
}: ViewSwitcherProps) {
	function handlePrev() {
		if (month === 1) {
			onMonthChange(year - 1, 12);
		} else {
			onMonthChange(year, month - 1);
		}
	}

	function handleNext() {
		if (month === 12) {
			onMonthChange(year + 1, 1);
		} else {
			onMonthChange(year, month + 1);
		}
	}

	const tabClass = (active: boolean) =>
		cn(
			"rounded-full px-4 py-1.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--lagoon)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)]",
			active
				? "bg-[var(--chip-bg)] border border-[var(--chip-line)] text-[var(--sea-ink)]"
				: "text-[var(--sea-ink-soft)] hover:text-[var(--sea-ink)]",
		);

	return (
		<div className="flex items-center justify-between gap-4 flex-wrap">
			<div className="flex items-center gap-1 rounded-full border border-[var(--chip-line)] bg-[var(--surface)] p-1">
				<button
					type="button"
					className={tabClass(view === "year")}
					onClick={() => onViewChange("year")}
					aria-pressed={view === "year"}
				>
					Year
				</button>
				<button
					type="button"
					className={tabClass(view === "month")}
					onClick={() => onViewChange("month")}
					aria-pressed={view === "month"}
				>
					Month
				</button>
			</div>

			{view === "month" && (
				<div className="flex items-center gap-2">
					<button
						type="button"
						onClick={handlePrev}
						aria-label="Previous month"
						className="inline-flex items-center justify-center size-8 rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] text-[var(--sea-ink-soft)] transition hover:text-[var(--sea-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--lagoon)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)]"
					>
						<ChevronLeft className="size-4" />
					</button>
					<span className="min-w-[10rem] text-center text-sm font-semibold text-[var(--sea-ink)]">
						{MONTH_NAMES[month - 1]} {year}
					</span>
					<button
						type="button"
						onClick={handleNext}
						aria-label="Next month"
						className="inline-flex items-center justify-center size-8 rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] text-[var(--sea-ink-soft)] transition hover:text-[var(--sea-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--lagoon)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)]"
					>
						<ChevronRight className="size-4" />
					</button>
				</div>
			)}

			{view === "year" && (
				<span className="text-sm font-semibold text-[var(--sea-ink-soft)]">
					{year}
				</span>
			)}
		</div>
	);
}
