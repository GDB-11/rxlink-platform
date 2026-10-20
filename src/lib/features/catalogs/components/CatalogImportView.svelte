<!-- src/lib/features/catalogs/components/CatalogImportView.svelte -->
<script lang="ts">
	import { resolve } from '$app/paths';
	import ErrorAlert from '$lib/components/ui/ErrorAlert.svelte';
	import type { CatalogMeta } from '../catalogMeta';
	import { importColumns } from '../importMeta';
	import { CatalogImportStore } from '../stores/catalogImport.svelte';
	import ImportColumnsHelp from './ImportColumnsHelp.svelte';
	import ImportFileForm from './ImportFileForm.svelte';
	import ImportReportView from './ImportReportView.svelte';

	interface Props {
		meta: CatalogMeta;
	}

	let { meta }: Props = $props();

	// The page remounts this view (via {#key}) when the catalog changes.
	// svelte-ignore state_referenced_locally
	const store = new CatalogImportStore(meta.slug);
	// svelte-ignore state_referenced_locally
	const columns = importColumns[meta.slug] ?? [];

	const committed = $derived(store.report?.committed ?? false);
</script>

<div class="space-y-5">
	<div>
		<h1 class="text-2xl font-semibold text-stone-900 dark:text-stone-50">
			Importar {meta.label.toLowerCase()}
		</h1>
		<a
			href={resolve(`/catalogos/${meta.slug}`)}
			class="text-sm text-teal-700 hover:underline dark:text-teal-400"
		>
			Volver a {meta.label.toLowerCase()}
		</a>
	</div>

	<ImportColumnsHelp {columns} />

	{#if !committed}
		<ImportFileForm
			file={store.file}
			busy={store.busy}
			onfile={(f) => store.setFile(f)}
			onpreview={() => store.preview()}
		/>
	{/if}

	<ErrorAlert message={store.error} />

	{#if store.report}
		<ImportReportView report={store.report} />
	{/if}

	{#if store.canCommit}
		<div class="flex gap-3">
			<button
				type="button"
				disabled={store.busy}
				onclick={() => store.commit()}
				class="cursor-pointer rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white
                       transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
			>
				{store.busy ? 'Importando…' : 'Confirmar importación'}
			</button>
		</div>
	{/if}

	{#if committed}
		<button
			type="button"
			onclick={() => store.reset()}
			class="cursor-pointer rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium
                   text-stone-700 transition-colors hover:bg-stone-100
                   dark:border-stone-600 dark:text-stone-200 dark:hover:bg-stone-800"
		>
			Importar otro archivo
		</button>
	{/if}
</div>
