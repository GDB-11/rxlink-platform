<!-- src/lib/features/catalogs/components/CatalogListView.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { MEDICATIONS_SLUG, type CatalogEntry } from '$lib/api/catalogApi';
	import ErrorAlert from '$lib/components/ui/ErrorAlert.svelte';
	import Pagination from '$lib/components/ui/Pagination.svelte';
	import SearchBar from '$lib/components/ui/SearchBar.svelte';
	import type { CatalogMeta } from '../catalogMeta';
	import { isImportable } from '../importMeta';
	import { CatalogListStore } from '../stores/catalogList.svelte';
	import CatalogEntryModal from './CatalogEntryModal.svelte';
	import CatalogTable from './CatalogTable.svelte';
	import ToggleActiveModal from './ToggleActiveModal.svelte';

	interface Props {
		meta: CatalogMeta;
	}

	let { meta }: Props = $props();

	// The page remounts this view (via {#key}) when the catalog changes.
	// svelte-ignore state_referenced_locally
	const store = new CatalogListStore(meta.slug);

	let editing = $state<{ entry: CatalogEntry | null } | null>(null);
	let toggling = $state<CatalogEntry | null>(null);

	onMount(() => {
		if (meta.slug !== MEDICATIONS_SLUG) store.loadFields();
		store.load();
	});

	async function confirmToggle() {
		if (!toggling) return;
		if (await store.setActive(toggling, !toggling.isActive)) toggling = null;
	}
</script>

<div class="space-y-4">
	<div class="flex flex-wrap items-center justify-between gap-3">
		<div>
			<h1 class="text-2xl font-semibold text-stone-900 dark:text-stone-50">{meta.label}</h1>
			<a
				href={resolve(`/catalogos/${meta.slug}/historial`)}
				class="text-sm text-teal-700 hover:underline dark:text-teal-400"
			>
				Ver historial de cambios
			</a>
			{#if isImportable(meta.slug)}
				<a
					href={resolve(`/catalogos/${meta.slug}/importar`)}
					class="ml-3 text-sm text-teal-700 hover:underline dark:text-teal-400"
				>
					Importar CSV
				</a>
			{/if}
		</div>
		<button
			type="button"
			onclick={() => (editing = { entry: null })}
			class="cursor-pointer rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white
                   transition-colors hover:bg-teal-700"
		>
			Nuev{meta.gender}
			{meta.singular}
		</button>
	</div>

	<div class="flex flex-wrap items-center gap-4">
		<div class="w-full max-w-sm">
			<SearchBar
				placeholder="Buscar…"
				disabled={store.loading}
				onsearch={(v) => store.setSearch(v)}
			/>
		</div>
		<label class="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400">
			<input
				type="checkbox"
				checked={store.includeInactive}
				onchange={(e) => store.setIncludeInactive(e.currentTarget.checked)}
				class="rounded border-stone-300 text-teal-600 focus:ring-teal-500"
			/>
			Mostrar inactivos
		</label>
	</div>

	<ErrorAlert message={store.error} />

	<CatalogTable
		{meta}
		items={store.items}
		loading={store.loading}
		busy={store.submitting}
		onEdit={(entry) => (editing = { entry })}
		onToggle={(entry) => (toggling = entry)}
	/>

	<Pagination
		page={store.page}
		pageSize={store.pageSize}
		total={store.total}
		totalPages={store.totalPages}
		loading={store.loading}
		onPageChange={(p) => store.goToPage(p)}
	/>
</div>

{#if editing}
	{#key editing}
		<CatalogEntryModal {meta} {store} entry={editing.entry} onclose={() => (editing = null)} />
	{/key}
{/if}

{#if toggling}
	<ToggleActiveModal
		{meta}
		entry={toggling}
		submitting={store.submitting}
		onconfirm={confirmToggle}
		oncancel={() => (toggling = null)}
	/>
{/if}
