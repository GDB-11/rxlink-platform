<!-- src/lib/features/catalogs/components/AuditTable.svelte -->
<script lang="ts">
	import type { CatalogAuditEntry } from '$lib/api/catalogApi';

	interface Props {
		items: CatalogAuditEntry[];
		loading: boolean;
	}

	let { items, loading }: Props = $props();

	const skeletonRows = [1, 2, 3, 4, 5];

	const actionLabels: Record<string, string> = {
		INSERT: 'Creación',
		UPDATE: 'Modificación',
		DELETE: 'Eliminación'
	};

	const dateFormat = new Intl.DateTimeFormat('es-PE', { dateStyle: 'short', timeStyle: 'medium' });

	function when(iso: string): string {
		// The API sends UTC timestamps without an offset.
		const utc = /[zZ]|[+-]\d{2}:?\d{2}$/.test(iso) ? iso : `${iso}Z`;
		return dateFormat.format(new Date(utc));
	}

	function parse(json: string | null): Record<string, unknown> {
		if (!json) return {};
		try {
			return JSON.parse(json) as Record<string, unknown>;
		} catch {
			return {};
		}
	}

	function show(value: unknown): string {
		return value === null || value === undefined || value === '' ? '—' : String(value);
	}

	/** "Campo: antes → después" per changed column (just the new value for a creation). */
	function changes(entry: CatalogAuditEntry): string[] {
		const before = parse(entry.oldValues);
		const after = parse(entry.newValues);
		const columns = entry.changedColumns?.length ? entry.changedColumns : Object.keys(after);
		return columns
			.filter((c) => c !== 'UpdatedAt' && c !== 'UpdatedBy')
			.map((c) =>
				entry.action === 'INSERT'
					? `${c}: ${show(after[c])}`
					: `${c}: ${show(before[c])} → ${show(after[c])}`
			);
	}
</script>

<div
	class="overflow-x-auto rounded-xl border border-stone-200 bg-white dark:border-stone-700 dark:bg-stone-900"
>
	<table class="w-full text-sm">
		<thead>
			<tr class="border-b border-stone-200 bg-stone-50 dark:border-stone-700 dark:bg-stone-800/60">
				{#each ['Fecha', 'Usuario', 'Acción', 'Cambios'] as heading (heading)}
					<th class="px-4 py-3 text-left font-medium text-stone-600 dark:text-stone-400">
						{heading}
					</th>
				{/each}
			</tr>
		</thead>
		<tbody class="divide-y divide-stone-100 dark:divide-stone-800">
			{#if loading}
				{#each skeletonRows as n (n)}
					<tr>
						<td colspan="4" class="px-4 py-3">
							<div class="h-4 w-full animate-pulse rounded bg-stone-200 dark:bg-stone-700"></div>
						</td>
					</tr>
				{/each}
			{:else if items.length === 0}
				<tr>
					<td colspan="4" class="px-4 py-12 text-center text-sm text-stone-500 dark:text-stone-400">
						Aún no hay cambios registrados.
					</td>
				</tr>
			{:else}
				{#each items as entry (entry.auditLogId)}
					<tr class="align-top">
						<td class="px-4 py-3 whitespace-nowrap text-stone-600 dark:text-stone-400">
							{when(entry.occurredAt)}
						</td>
						<td class="px-4 py-3 text-stone-900 dark:text-stone-50">{entry.changedBy ?? '—'}</td>
						<td class="px-4 py-3 text-stone-600 dark:text-stone-400">
							{actionLabels[entry.action] ?? entry.action}
						</td>
						<td class="px-4 py-3 text-stone-600 dark:text-stone-400">
							<ul class="space-y-0.5 font-mono text-xs">
								{#each changes(entry) as line (line)}
									<li>{line}</li>
								{/each}
							</ul>
						</td>
					</tr>
				{/each}
			{/if}
		</tbody>
	</table>
</div>
