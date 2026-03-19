import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type ThemeMode = "light" | "dark" | "auto";

const MODE_LABELS: Record<ThemeMode, string> = {
	light: "Light",
	dark: "Dark",
	auto: "System",
};

function getInitialMode(): ThemeMode {
	if (typeof window === "undefined") {
		return "auto";
	}

	const stored = window.localStorage.getItem("theme");
	if (stored === "light" || stored === "dark" || stored === "auto") {
		return stored;
	}

	return "auto";
}

function applyThemeMode(mode: ThemeMode) {
	const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
	const resolved = mode === "auto" ? (prefersDark ? "dark" : "light") : mode;

	document.documentElement.classList.remove("light", "dark");
	document.documentElement.classList.add(resolved);

	if (mode === "auto") {
		document.documentElement.removeAttribute("data-theme");
	} else {
		document.documentElement.setAttribute("data-theme", mode);
	}

	document.documentElement.style.colorScheme = resolved;
}

export default function ThemeToggle() {
	const [mode, setMode] = useState<ThemeMode>("auto");

	useEffect(() => {
		const initialMode = getInitialMode();
		setMode(initialMode);
		applyThemeMode(initialMode);
	}, []);

	useEffect(() => {
		if (mode !== "auto") {
			return;
		}

		const media = window.matchMedia("(prefers-color-scheme: dark)");
		const onChange = () => applyThemeMode("auto");

		media.addEventListener("change", onChange);
		return () => {
			media.removeEventListener("change", onChange);
		};
	}, [mode]);

	const nextMode: ThemeMode =
		mode === "light" ? "dark" : mode === "dark" ? "auto" : "light";

	function toggleMode() {
		setMode(nextMode);
		applyThemeMode(nextMode);
		window.localStorage.setItem("theme", nextMode);
	}

	const label = `Theme mode: ${MODE_LABELS[mode]}. Click to switch to ${MODE_LABELS[nextMode]}.`;

	return (
		<button
			type="button"
			onClick={toggleMode}
			aria-label={label}
			title={label}
			className="group inline-flex cursor-pointer items-center gap-2 rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-3 py-1.5 text-sm font-semibold text-[var(--sea-ink)] shadow-[0_8px_22px_rgba(30,90,72,0.08)] transition hover:-translate-y-0.5 hover:bg-[color-mix(in_oklab,var(--chip-bg)_82%,white_18%)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--lagoon)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)]"
		>
			<span className="relative size-4">
				<Sun className="absolute inset-0 size-4 rotate-0 scale-100 transition-transform duration-200 ease-out dark:-rotate-90 dark:scale-0" />
				<Moon className="absolute inset-0 size-4 rotate-90 scale-0 transition-transform duration-200 ease-out dark:rotate-0 dark:scale-100" />
			</span>
			<span>{MODE_LABELS[mode]}</span>
		</button>
	);
}
