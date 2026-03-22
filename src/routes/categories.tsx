import { queryOptions, useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Pencil, Plus, Trash2 } from "lucide-react";
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
import {
	addCategory,
	deleteCategory,
	fetchCategories,
	updateCategory,
} from "#/server/categories";

const categoriesQueryOptions = queryOptions({
	queryKey: ["categories"],
	queryFn: () => fetchCategories(),
});

export const Route = createFileRoute("/categories")({
	loader: ({ context }) =>
		context.queryClient.ensureQueryData(categoriesQueryOptions),
	component: CategoriesPage,
});

type CategoryFormData = {
	name: string;
	color: string;
};

function CategoriesPage() {
	const { data: categories = [], refetch } = useQuery(categoriesQueryOptions);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editingId, setEditingId] = useState<number | null>(null);
	const [formData, setFormData] = useState<CategoryFormData>({
		name: "",
		color: "#4fb8b2",
	});
	const [error, setError] = useState<string | null>(null);

	const addMutation = useMutation({
		mutationFn: (data: CategoryFormData) => addCategory({ data }),
		onSuccess: () => {
			refetch();
			closeDialog();
		},
	});

	const updateMutation = useMutation({
		mutationFn: (data: { id: number; name: string; color: string }) =>
			updateCategory({ data }),
		onSuccess: () => {
			refetch();
			closeDialog();
		},
	});

	const deleteMutation = useMutation({
		mutationFn: (id: number) => deleteCategory({ data: { id } }),
		onSuccess: () => {
			refetch();
		},
		onError: (err) => {
			setError(err.message);
		},
	});

	function openAddDialog() {
		setEditingId(null);
		setFormData({ name: "", color: "#4fb8b2" });
		setError(null);
		setDialogOpen(true);
	}

	function openEditDialog(cat: { id: number; name: string; color: string }) {
		setEditingId(cat.id);
		setFormData({ name: cat.name, color: cat.color });
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
		if (!formData.name.trim()) return;

		if (editingId !== null) {
			updateMutation.mutate({
				id: editingId,
				name: formData.name.trim(),
				color: formData.color,
			});
		} else {
			addMutation.mutate({
				name: formData.name.trim(),
				color: formData.color,
			});
		}
	}

	const isSubmitting = addMutation.isPending || updateMutation.isPending;

	return (
		<main className="page-wrap px-4 pb-8 pt-10">
			<div className="mb-6 flex items-center justify-between gap-4">
				<h1 className="text-2xl font-bold text-[var(--sea-ink)] sm:text-3xl">
					Categories
				</h1>
				<Button
					type="button"
					onClick={openAddDialog}
					className="inline-flex items-center gap-2 rounded-full bg-[var(--lagoon)] px-4 py-2 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(79,184,178,0.35)] transition hover:-translate-y-0.5 hover:bg-[var(--lagoon-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--lagoon)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)]"
				>
					<Plus className="size-4" />
					New Category
				</Button>
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
				<div className="grid gap-3">
					{categories.map((cat) => (
						<div
							key={cat.id}
							className="flex items-center gap-4 rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-3"
						>
							<span
								className="size-6 shrink-0 rounded-full border border-[var(--line)]"
								style={{ backgroundColor: cat.color }}
							/>
							<span className="flex-1 text-sm font-medium text-[var(--sea-ink)]">
								{cat.name}
							</span>
							<button
								type="button"
								onClick={() => openEditDialog(cat)}
								className="rounded-lg p-1.5 text-[var(--sea-ink-soft)] transition hover:bg-[var(--chip-bg)] hover:text-[var(--sea-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--lagoon)]"
								aria-label={`Edit ${cat.name}`}
							>
								<Pencil className="size-4" />
							</button>
							<button
								type="button"
								onClick={() => deleteMutation.mutate(cat.id)}
								disabled={deleteMutation.isPending}
								className={cn(
									"rounded-lg p-1.5 text-[var(--sea-ink-soft)] transition hover:bg-red-100 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:hover:bg-red-950 dark:hover:text-red-400",
									deleteMutation.isPending && "opacity-50",
								)}
								aria-label={`Delete ${cat.name}`}
							>
								<Trash2 className="size-4" />
							</button>
						</div>
					))}
					{categories.length === 0 && (
						<p className="py-8 text-center text-sm text-[var(--sea-ink-soft)]">
							No categories yet. Add one to get started.
						</p>
					)}
				</div>
			</section>

			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>
							{editingId !== null ? "Edit Category" : "New Category"}
						</DialogTitle>
					</DialogHeader>
					<form onSubmit={handleSubmit} className="grid gap-4 pt-2">
						<div className="grid gap-2">
							<Label htmlFor="cat-name">Name</Label>
							<Input
								id="cat-name"
								value={formData.name}
								onChange={(e) =>
									setFormData((prev) => ({ ...prev, name: e.target.value }))
								}
								placeholder="e.g. Groceries"
								required
								autoFocus
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="cat-color">Color</Label>
							<div className="flex items-center gap-3">
								<input
									id="cat-color"
									type="color"
									value={formData.color}
									onChange={(e) =>
										setFormData((prev) => ({ ...prev, color: e.target.value }))
									}
									className="h-10 w-14 cursor-pointer rounded-lg border border-[var(--line)] bg-transparent p-1"
								/>
								<Input
									value={formData.color}
									onChange={(e) =>
										setFormData((prev) => ({ ...prev, color: e.target.value }))
									}
									placeholder="#000000"
									className="flex-1 font-mono text-sm"
								/>
							</div>
						</div>
						<div className="flex justify-end gap-2 pt-2">
							<Button type="button" variant="outline" onClick={closeDialog}>
								Cancel
							</Button>
							<Button
								type="submit"
								disabled={isSubmitting || !formData.name.trim()}
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
