<!-- src/lib/features/catalogs/components/ImportReportView.svelte -->
<script lang="ts">
	import type { CatalogImportReport } from '$lib/api/catalogApi';
	import { actionLabels, committedActionLabels } from '../importMeta';

	interface Props {
		report: CatalogImportReport;
	}

	let { report }: Props = $props();

	const labels = $derived(report.committed ? committedActionLabels : actionLabels);
	const summary = $derived([
		{ label: report.committed ? 'Creados' : 'Por crear', value: report.created },
		{ label: report.committed ? 'Actualizados' : 'Por actualizar', value: report.updated },
		{ label: 'Sin cambios', value: report.unchanged },
		{ label: 'Omitidos', value: report.skipped }
	]);
</script>

<div class="space-y-4">
	{#if report.errors.length > 0}
		<div
			class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800
                   dark:border-red-800 dark:bg-red-900/30 dark:text-red-300"
			role="alert"
		>
			<p class="font-medium">
				El archivo tiene {report.errors.length} error{report.errors.length === 1 ? '' : 'es'}; no se
				aplicó ningún cambio.
			</p>
			<ul class="mt-2 list-inside list-disc">
				{#each report.errors as e, i (i)}
					<li>
						Línea {e.line}{e.field ? ` (${e.field})` : ''}: {e.message}
					</li>
				{/each}
			</ul>
		</div>
	{:else if report.total === 0}
		<p class="text-sm text-stone-500 dark:text-stone-400">El archivo no contiene filas.</p>
	{:else}
		<div
			class="rounded-lg border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-800
                   dark:border-teal-800 dark:bg-teal-900/30 dark:text-teal-300"
			role="status"
		>
			{report.committed
				? `Importación completada: ${report.total} filas procesadas.`
				: `Previsualización: ${report.total} filas válidas. Aún no se ha guardado nada.`}
		</div>

		<dl class="grid grid-cols-2 gap-3 sm:grid-cols-4">
			{#each summary as s (s.label)}
				<div
					class="rounded-lg border border-stone-200 bg-white px-3 py-2 dark:border-stone-700 dark:bg-stone-900"
				>
					<dt class="text-xs text-stone-500 dark:text-stone-400">{s.label}</dt>
					<dd class="text-lg font-semibold text-stone-900 dark:text-stone-50">{s.value}</dd>
				</div>
			{/each}
		</dl>

		<div
			class="overflow-x-auto rounded-xl border border-stone-200 bg-white dark:border-stone-700 dark:bg-stone-900"
		>
			<table class="w-full text-left text-sm">
				<thead class="border-b border-stone-200 text-stone-500 dark:border-stone-700">
					<tr>
						<th class="px-4 py-2 font-medium">Línea</th>
						<th class="px-4 py-2 font-medium">Registro</th>
						<th class="px-4 py-2 font-medium">Acción</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-stone-100 dark:divide-stone-800">
					{#each report.rows as row (row.line)}
						<tr class="text-stone-900 dark:text-stone-100">
							<td class="px-4 py-2">{row.line}</td>
							<td class="px-4 py-2">{row.label}</td>
							<td class="px-4 py-2">{labels[row.action]}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>
