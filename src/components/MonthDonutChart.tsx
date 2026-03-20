import { useEffect, useState } from "react";
import {
	Cell,
	Legend,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
} from "recharts";
import type { Category } from "#/lib/mockData";

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

type DonutEntry = {
	category: Category;
	total: number;
	fill: string;
};

type MonthDonutChartProps = {
	data: DonutEntry[];
	year: number;
	month: number;
};

export default function MonthDonutChart({
	data,
	year,
	month,
}: MonthDonutChartProps) {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return <div className="h-80 animate-pulse rounded-xl bg-[var(--line)]" />;
	}

	const total = data.reduce((sum, entry) => sum + entry.total, 0);
	const monthLabel = MONTH_NAMES[month - 1];

	return (
		<ResponsiveContainer width="100%" height={320}>
			<PieChart>
				<Pie
					data={data}
					dataKey="total"
					nameKey="category"
					innerRadius="55%"
					outerRadius="80%"
					paddingAngle={2}
				>
					{data.map((entry) => (
						<Cell key={entry.category} fill={entry.fill} />
					))}
					<text
						x="50%"
						y="47%"
						textAnchor="middle"
						dominantBaseline="middle"
						style={{
							fill: "var(--sea-ink)",
							fontSize: "1.25rem",
							fontWeight: 700,
						}}
					>
						{total} zł
					</text>
					<text
						x="50%"
						y="56%"
						textAnchor="middle"
						dominantBaseline="middle"
						style={{ fill: "var(--sea-ink-soft)", fontSize: "0.75rem" }}
					>
						{monthLabel} {year}
					</text>
				</Pie>
				<Tooltip
					contentStyle={{
						background: "var(--surface-strong)",
						border: "1px solid var(--line)",
						borderRadius: "0.75rem",
						fontSize: "13px",
						color: "var(--sea-ink)",
					}}
					formatter={(value: number) => [`${value} zł`]}
				/>
				<Legend
					formatter={(value) => (
						<span style={{ color: "var(--sea-ink)", fontSize: "13px" }}>
							{value}
						</span>
					)}
				/>
			</PieChart>
		</ResponsiveContainer>
	);
}
