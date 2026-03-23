import { useEffect, useState } from "react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import type { CategoryInfo } from "#/lib/mockData";

type YearBarChartProps = {
	data: Record<string, number | string>[];
	categoryList: CategoryInfo[];
};

export default function YearBarChart({ data, categoryList }: YearBarChartProps) {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return <div className="h-80 animate-pulse rounded-xl bg-[var(--line)]" />;
	}

	const lastCategoryIndex = categoryList.length - 1;

	return (
		<ResponsiveContainer width="100%" height={320}>
			<BarChart data={data} margin={{ top: 4, right: 0, left: -16, bottom: 0 }}>
				<CartesianGrid vertical={false} stroke="var(--line)" />
				<XAxis
					dataKey="month"
					axisLine={false}
					tickLine={false}
					tick={{ fill: "var(--sea-ink-soft)", fontSize: 12 }}
				/>
				<YAxis
					axisLine={false}
					tickLine={false}
					tick={{ fill: "var(--sea-ink-soft)", fontSize: 12 }}
					tickFormatter={(v) => `${v}`}
				/>
				<Tooltip
					cursor={{ fill: "rgba(0,0,0,0.04)" }}
					contentStyle={{
						background: "var(--surface-strong)",
						border: "1px solid var(--line)",
						borderRadius: "0.75rem",
						fontSize: "13px",
						color: "var(--sea-ink)",
					}}
					formatter={(value: number, name: string) => [`${value} zł`, name]}
				/>
				{categoryList.map((cat, idx) => (
					<Bar
						key={cat.name}
						dataKey={cat.name}
						stackId="a"
						fill={cat.color}
						radius={idx === lastCategoryIndex ? [4, 4, 0, 0] : [0, 0, 0, 0]}
					/>
				))}
			</BarChart>
		</ResponsiveContainer>
	);
}
