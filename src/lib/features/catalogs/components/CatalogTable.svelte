<!-- src/lib/features/catalogs/components/CatalogTable.svelte -->
<script lang="ts">
	import type { CatalogEntry } from '$lib/api/catalogApi';
	import CatalogStatusBadge from '$lib/components/ui/CatalogStatusBadge.svelte';
	import type { CatalogMeta } from '../catalogMeta';

	interface Props {
		meta: CatalogMeta;
		items: CatalogEntry[];
		loading: boolean;
		busy?: boolean;
		onEdit: (entry: CatalogEntry) => void;
		onToggle: (entry: CatalogEntry) => void;
	}

	let { meta, items, loading, busy = false, onEdit, onToggle }: Props = $props();

	const skeletonRows = [1, 2, 3, 4, 5];
	const colspan = $derived(meta.columns.length + 2);

	function cell(entry: CatalogEntry, key: string, format?: (e: CatalogEntry) => string): string {
		return format ? format(entry) : String(entry[key] ?? '—');
	}

	const actionClass = `cursor-pointer rounded-lg border border-stone-200 px-3 py-1 text-xs font-medium
		text-stone-600 transition-colors hover:bg-stone-50 hover:text-stone-900
		disabled:cursor-not-allowed disabled:opacity-50 dark:border-stone-700 dark:text-stone-400
		dark:hover:bg-stone-800 dark:hover:text-stone-50`;
</script>

<div
	class="overflow-x-auto rounded-xl border border-stone-200 bg-white dark:border-stone-700 dark:bg-stone-900"
>
	<table class="w-full text-sm">
		<thead>
			<tr class="border-b border-stone-200 bg-stone-50 dark:border-stone-700 dark:bg-stone-800/60">
				{#each meta.columns as column (column.key)}
					<th class="px-4 py-3 text-left font-medium text-stone-600 dark:text-stone-400">
						{column.label}
					</th>
				{/each}
				<th class="px-4 py-3 text-left font-medium text-stone-600 dark:text-stone-400">Estado</th>
				<th class="px-4 py-3 text-right font-medium text-stone-600 dark:text-stone-400">
					Acciones
				</th>
			</tr>
		</thead>
		<tbody class="divide-y divide-stone-100 dark:divide-stone-800">
			{#if loading}
				{#each skeletonRows as n (n)}
					<tr>
						<td class="px-4 py-3" {colspan}>
							<div class="h-4 w-full animate-pulse rounded bg-stone-200 dark:bg-stone-700"></div>
						</td>
					</tr>
				{/each}
			{:else if items.length === 0}
				<tr>
					<td {colspan} class="px-4 py-12 text-center">
						<p class="text-sm text-stone-500 dark:text-stone-400">No se encontraron registros.</p>
					</td>
				</tr>
			{:else}
				{#each items as entry (entry.code)}
					<tr class="transition-colors hover:bg-stone-50 dark:hover:bg-stone-800/40">
						{#each meta.columns as column, i (column.key)}
							<td
								class="px-4 py-3 {i === 0
									? 'font-medium text-stone-900 dark:text-stone-50'
									: 'text-stone-600 dark:text-stone-400'}"
							>
								{cell(entry, column.key, column.format)}
							</td>
						{/each}
						<td class="px-4 py-3"><CatalogStatusBadge isActive={entry.isActive} /></td>
						<td class="px-4 py-3">
							<div class="flex justify-end gap-2">
								<button
									type="button"
									class={actionClass}
									disabled={busy}
									onclick={() => onEdit(entry)}
								>
									Editar
								</button>
								<button
									type="button"
									class={actionClass}
									disabled={busy}
									onclick={() => onToggle(entry)}
								>
									{entry.isActive ? 'Desactivar' : 'Activar'}
								</button>
							</div>
						</td>
					</tr>
				{/each}
			{/if}
		</tbody>
	</table>
</div>
